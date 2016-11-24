using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Services;
using System.Web.Script.Services;
using System.Xml;
using System.Diagnostics;
using Microsoft.VisualBasic;
using System.Security.Policy;
using Microsoft.Win32;
using System.Security.Principal;
using System.Net;
using System.Data.OleDb;
using System.Data;
using System.Configuration;
using NetGearDBAnalyticsEF;
using System.Xml.Linq;
using System.Text.RegularExpressions;
using NetgearClientService.NetgearService;
using NetgearClientService.DataAccess;
using NetgearClientService.Tracker;
using System.Web.Script.Serialization;
using NetgearClientService.RightNowKnowledgeService;
using System.Net.Security;
using NetgearClientService.MessageCenterService;
using NetgearClientService.MessageCenterService.svc;
using System.Runtime.Serialization;
using System.Globalization;
using System.Web;
using System.Data.Objects.SqlClient;
using System.IO;
using System.Security.Cryptography.X509Certificates;
using System.Net.Sockets;

namespace NetgearClientService.CSSNetgearService
{
    /// <summary>
    /// Summary description for NetgearClientService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [ScriptService]
    public class NetgearClientService : WebService
    {
        #region Customer Login

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public CustomerItems CustomerLogin(string email, string password)
        {
            var getCusomerSearchType = new CustomerSearchType();
            var getContractsSearchByCustomer = new ContractsSearchByCustomerID();
            var getCustomerItems = new CustomerItems();

            try
            {
                CustomerLoginType getCustomerLoginType;
                using (var getServiceClient = new ServicesClient())
                {
                    getCustomerLoginType = getServiceClient.CustomerLogin(APIService.GetAPIString(), email, password);
                }

                if (!string.IsNullOrEmpty(getCustomerLoginType.SessionID))
                {
                    getCusomerSearchType = CustomerSearch(getCustomerLoginType.CustomerID, email, string.Empty,
                                                          string.Empty, string.Empty, 0);
                    getCustomerLoginType.PortalID = getCustomerLoginType.PortalID.Trim();

                }
                if (getCusomerSearchType.CustomerInfo != null)
                {
                    if (getCusomerSearchType.CustomerInfo.Count() > 0)
                    {
                        getCustomerItems.CustomerId = getCusomerSearchType.CustomerInfo[0].Customer_ID.ToString().Trim();
                        getCustomerItems.CustomerEmail = email.Trim();
                        getCustomerItems.SessionId = getCustomerLoginType.SessionID.Trim();
                        getCustomerItems.PortalId = getCustomerLoginType.PortalID.Trim();
                        getCustomerItems.Country = getCusomerSearchType.CustomerInfo[0].Country.Trim();
                        //Added By Sudarson Krishnamoorthy on 4 July 2013 for removing Special Characters from FirstName and LastName
                        getCustomerItems.FirstName = Regex.Replace(getCusomerSearchType.CustomerInfo[0].First_Name.Trim(), "[^a-zA-Z0-9% ._]", string.Empty);
                        getCustomerItems.LastName = Regex.Replace(getCusomerSearchType.CustomerInfo[0].Last_Name.Trim(), "[^a-zA-Z0-9% ._]", string.Empty);
                        getCustomerItems.EmailConfirmed = getCustomerLoginType.EmailConfirmed;
                    }
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerLogin", "CustomerLogin()", "", ex.Message,
                                         ex.StackTrace, "Error");
            }

            // SessionId, CustomerID and email id
            return getCustomerItems;
        }

        #endregion

        /*        #region Customer Login

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public CustomerItems NetgearLogin(string email, string password)
        {
            EcoLoginType getLogin;
            var getCusomerSearchType = new CustomerSearchType();
            var getCustomerItems = new CustomerItems();

            using (var getServiceClient = new ServicesClient())
            {
                getLogin = getServiceClient.EcoLogin(APIService.GetAPIString(), email, password);
            }

            //UserSession.UserSessionID = getLogin.SessionID;
            if (!string.IsNullOrEmpty(getLogin.SessionID))
            {
                getCusomerSearchType = CustomerSearch(0, email, string.Empty, string.Empty, string.Empty, 0);
            }

            if (getCusomerSearchType.CustomerInfo.Count() > 0)
            {
                getCustomerItems.CustomerId = getCusomerSearchType.CustomerInfo[0].Customer_ID.ToString();
                getCustomerItems.CustomerEmail = email;
                getCustomerItems.SessionId = getLogin.SessionID;
            }

            // SessionId, CustomerID and email id
            return getCustomerItems;
            //return getLogin.SessionID;
            //return "text";            
        }

        #endregion
         * 
*/
        /// <summary>
        /// Functionality used for Phone Tracking login 
        /// Return  the Phone Tracking enabled or not
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public int PhoneTrackerLogin(string email, string password)
        {
            int status = 0;
            var getCusomerSearchType = new CustomerSearchType();
            var getContractsSearchByCustomer = new ContractsSearchByCustomerID();
            var getCustomerItems = new CustomerItems();

            try
            {
                CustomerLoginType getCustomerLoginType;
                using (var getServiceClient = new ServicesClient())
                {
                    getCustomerLoginType = getServiceClient.CustomerLogin(APIService.GetAPIString(), email, password);
                }

                if (!string.IsNullOrEmpty(getCustomerLoginType.SessionID))
                {
                    getCusomerSearchType = CustomerSearch(getCustomerLoginType.CustomerID, email, string.Empty,
                                                          string.Empty, string.Empty, 0);
                    getCustomerLoginType.PortalID = getCustomerLoginType.PortalID.Trim();

                }
                if (getCusomerSearchType.CustomerInfo != null)
                {
                    if (getCusomerSearchType.CustomerInfo.Count() > 0)
                    {
                        getCustomerItems.CustomerId = getCusomerSearchType.CustomerInfo[0].Customer_ID.ToString().Trim();
                        getCustomerItems.CustomerEmail = email.Trim();
                        getCustomerItems.SessionId = getCustomerLoginType.SessionID.Trim();
                        getCustomerItems.PortalId = getCustomerLoginType.PortalID.Trim();
                        getCustomerItems.Country = getCusomerSearchType.CustomerInfo[0].Country.Trim();
                        //Added By Sudarson Krishnamoorthy on 4 July 2013 for removing Special Characters from FirstName and LastName
                        getCustomerItems.FirstName = Regex.Replace(getCusomerSearchType.CustomerInfo[0].First_Name.Trim(), "[^a-zA-Z0-9% ._]", string.Empty);
                        getCustomerItems.LastName = Regex.Replace(getCusomerSearchType.CustomerInfo[0].Last_Name.Trim(), "[^a-zA-Z0-9% ._]", string.Empty);
                    }
                    if (getCustomerItems.CustomerId != null)
                    {
                        PhoneSettings objDeviceSettings = new PhoneSettings();
                        using (NGStatusEntities srp_context = new NGStatusEntities())
                        {
                            int CustomerId = Convert.ToInt32(getCustomerItems.CustomerId);
                            objDeviceSettings = srp_context.PhoneSettings.Where(x => x.CustomerID == CustomerId).FirstOrDefault();
                            if (objDeviceSettings != null)
                            {
                                if (objDeviceSettings.IsPhoneTrack)
                                {
                                    status = 3;
                                }
                                else
                                {
                                    status = 2;
                                }
                            }
                            else
                            {
                                status = 2;
                            }
                        }

                    }
                    else
                    {
                        status = 1;
                    }
                }
                else
                {
                    status = 1;
                }

            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerLogin", "PhoneTrackerLogin()", "", ex.Message,
                        ex.StackTrace, "Error");
                return 0;
            }

            // SessionId, CustomerID and email id
            return status;
        }

        #region Customer Logout

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string EcoLogout(string sessionId)
        {
            int ecoLogout = 0;
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    ecoLogout = getServiceClient.EcoLogout(APIService.GetAPIString(), sessionId);
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/EcoLogout", "EcoLogout()", "", ex.Message,
                                         ex.StackTrace, "Error");
            }
            return ecoLogout.ToString();
        }

        #endregion

        #region Search Customer (Also Customer Profile)

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public CustomerSearchType CustomerSearch(int customerId, string email, string phoneNo, string isoCountry, string companyName, int exactPhone)
        {
            var getCusomerSearchType = new CustomerSearchType();
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    getCusomerSearchType = getServiceClient.CustomerSearch(APIService.GetAPIString(), customerId, email, phoneNo, isoCountry, companyName, exactPhone);
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerSearch", "CustomerSearch()", "", ex.Message, ex.StackTrace, "Error");
            }
            return getCusomerSearchType;
        }

        /// <summary>
        /// Used to create new customer
        /// </summary>
        /// <param name="customerType"></param>
        /// <param name="partnerLevel"></param>
        /// <param name="firstName"></param>
        /// <param name="lastName"></param>
        /// <param name="phone"></param>
        /// <param name="email"></param>
        /// <param name="city"></param>
        /// <param name="state"></param>
        /// <param name="postcode"></param>
        /// <param name="country"></param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public CustomerCreateType CreateCustomer(string customerType, string partnerLevel, string firstName, string lastName, string phone, string email, string city, string state, string postcode, string country, bool mailProgram, string userPassword)
        {
            CustomerCreateType createCustomer = new CustomerCreateType();
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    //createCustomer = getServiceClient.CustomerCreate(APIService.GetAPIString(), customerType, partnerLevel, firstName, lastName, phone, email, city, state, postcode, country, mailProgram, true, string.Empty, false);
                    createCustomer = getServiceClient.CustomerCreate(APIService.GetAPIString(), customerType, partnerLevel, firstName, lastName, phone, email, city, state, postcode, country, mailProgram, true, userPassword, false);
                }
            }
            catch (Exception ex)
            {
                createCustomer = null;
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CreateCustomer", "CreateCustomer()", "", ex.Message, ex.StackTrace, "Error");
            }
            return createCustomer;
        }

        /// <summary>
        /// Functionality used to resend the verification mail 
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public int SendConfirmationMail(string email)
        {
            SendConfirmEmailResult sendMailres = new SendConfirmEmailResult();
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    sendMailres = getServiceClient.SendConfirmationEmail(APIService.GetAPIString(), email);
                    return sendMailres.ResultCode;
                }
            }
            catch (Exception ex)
            {

                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CreateCustomer", "CreateCustomer()", "", ex.Message, ex.StackTrace, "Error");
                return -1;
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public RegistrationSearchBySerialNumberType IsSerialNumberExists(string serialNumber)
        {
            RegistrationSearchBySerialNumberType serialNumberCheck = new RegistrationSearchBySerialNumberType();
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    serialNumberCheck = getServiceClient.RegistrationSearchBySerialNumber(APIService.GetAPIString(), serialNumber);
                }
            }
            catch (Exception ex)
            {
                serialNumberCheck = null;
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CreateCustomer", "CreateCustomer()", "", ex.Message, ex.StackTrace, "Error");
            }
            return serialNumberCheck;
        }

        /// <summary>
        /// Functionality use to update the customer details
        /// </summary>
        /// <param name="customerID"></param>
        /// <param name="firstName"></param>
        /// <param name="lastName"></param>
        /// <param name="phone"></param>
        /// <param name="email"></param>
        /// <param name="city"></param>
        /// <param name="state"></param>
        /// <param name="postcode"></param>
        /// <param name="country"></param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public int CustomerUpdate(int customerID, string firstName, string lastName, string phone, string email, string city, string state, string postcode, string country)
        {
            CustomerUpdateType customerUpdateDet = new CustomerUpdateType();
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    customerUpdateDet = getServiceClient.CustomerUpdate(APIService.GetAPIString(), customerID, string.Empty, string.Empty, firstName, lastName, phone, email, city, state, postcode, country, false, false, string.Empty, false);
                }
            }
            catch (Exception ex)
            {
                customerUpdateDet = null;
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerUpdate", "CustomerUpdate()", "", ex.Message, ex.StackTrace, "Error");
            }
            return customerUpdateDet.ResultCode;
        }

        #endregion

        #region "Product Registration"

        /// <summary>
        /// Functoinality used to register the product
        /// </summary>
        /// <param name="customerID"></param>
        /// <param name="email"></param>
        /// <param name="phone"></param>
        /// <param name="country"></param>
        /// <param name="serialNumber"></param>
        /// <param name="purchaseDate"></param>
        /// <param name="purchasedCountry"></param>
        /// <param name="source"></param>
        /// <param name="ipAddress"></param>
        /// <param name="pusrchaseFrom"></param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public RegistrationCreateType ProductRegistration(int customerID, string email, string phone, string country, string serialNumber, DateTime purchaseDate, string purchasedCountry, string source, string ipAddress, string pusrchaseFrom)
        {
            RegistrationCreateType registrationDetails = new RegistrationCreateType();
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    registrationDetails = getServiceClient.RegistrationCreate(APIService.GetAPIString(), customerID, email, phone, country, serialNumber, purchaseDate, purchasedCountry, source, ipAddress, pusrchaseFrom);
                }
            }
            catch (Exception ex)
            {
                registrationDetails = null;
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/ProductRegistration", "ProductRegistration()", "", ex.Message, ex.StackTrace, "Error");
            }
            return registrationDetails;
        }

        #endregion

        #region Search Contracts by Customer Id ()

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public ContractsSearchByCustomerID GetContractsbyCustomerId(int customerId)
        {
            var getContractSearchType = new ContractsSearchByCustomerID();
            //CustomerSearchType getCusomerSearchType;
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    //getContractSearchType = getServiceClient.GetContractsByCustomerID(APIService.GetAPIString(), customerId);
                    getContractSearchType = getServiceClient.CustomerGetContracts(APIService.GetAPIString(), customerId);
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/GetContractsbyCustomerID", "GetContractsbyCustomerID()", "", ex.Message, ex.StackTrace, "Error");
            }
            return getContractSearchType;
        }

        #endregion

        #region Customer Get Cases

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<CaseItems> CustomerGetCases(int customerId, string customerEmail, string customerPhoneNo, string customerIsoCountry, int customerExactPhone)
        {
            List<CaseItems> caseItems = new List<CaseItems>();
            //2951402
            try
            {
                CustomerGetCaseType getCustomerGetCase;
                CaseSearchByCustomerIDType case1 = new CaseSearchByCustomerIDType();
                CaseSearchByCaseIDType searchByCaseId;
                using (var getServiceClient = new ServicesClient())
                {
                    getCustomerGetCase = getServiceClient.CustomerGetCases(APIService.GetAPIString(), customerId, customerEmail, customerPhoneNo, customerIsoCountry, customerExactPhone);
                }

                for (int i = 0; i < getCustomerGetCase.CaseLists.Count(); i++)
                {
                    searchByCaseId = new CaseSearchByCaseIDType();
                    if (getCustomerGetCase.CaseLists[i].Source == "Online")
                    {
                        using (var getServiceClient = new ServicesClient())
                        {
                            searchByCaseId = getServiceClient.CaseSearchByCaseID(APIService.GetAPIString(), getCustomerGetCase.CaseLists[i].Case_ID);
                        }
                        caseItems.Add(new CaseItems
                        {
                            CaseId = getCustomerGetCase.CaseLists[i].Case_ID,
                            CaseNo = getCustomerGetCase.CaseLists[i].Case_ID,
                            CaseProduct = getCustomerGetCase.CaseLists[i].Product,
                            CaseStatus = getCustomerGetCase.CaseLists[i].Status,
                            CaseSummary = getCustomerGetCase.CaseLists[i].Summary,
                            RegistrationId = getCustomerGetCase.CaseLists[i].Registration_ID.ToString(),
                            SerialNo = getCustomerGetCase.CaseLists[i].Serial_Number,
                            CreatedDate = Convert.ToDateTime(searchByCaseId.Cases.InsertDate),
                            UpdatedDate = Convert.ToDateTime(searchByCaseId.Cases.UpdateDate)
                            //CreatedDate = DateTime.Now,
                            //UpdatedDate = DateTime.Now
                        });


                    }
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerGetCases", "CustomerGetCases()", "", ex.Message, ex.StackTrace, "Error");
                return null;
            }
            return caseItems;
        }

        /// <summary>
        /// Get all cases irespective of sourses(Email/Phone/Chat)
        /// </summary>        
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<CaseItems> CustomerGetAllCases(int customerId, string customerEmail, string customerPhoneNo, string customerIsoCountry, int customerExactPhone)
        {
            List<CaseItems> caseItems = new List<CaseItems>();
            try
            {
                CustomerGetCaseType getCustomerGetCase;
                CaseSearchByCaseIDType searchByCaseId;
                using (var getServiceClient = new ServicesClient())
                {
                    getCustomerGetCase = getServiceClient.CustomerGetCases(APIService.GetAPIString(), customerId, customerEmail, customerPhoneNo, customerIsoCountry, customerExactPhone);
                }
                for (int i = 0; i < getCustomerGetCase.CaseLists.Count(); i++)
                {
                    searchByCaseId = new CaseSearchByCaseIDType();
                    using (var getServiceClient = new ServicesClient())
                    {
                        searchByCaseId = getServiceClient.CaseSearchByCaseID(APIService.GetAPIString(), getCustomerGetCase.CaseLists[i].Case_ID);
                    }
                    caseItems.Add(new CaseItems
                    {
                        CaseId = getCustomerGetCase.CaseLists[i].Case_ID,
                        CaseNo = getCustomerGetCase.CaseLists[i].Case_ID,
                        CaseProduct = getCustomerGetCase.CaseLists[i].Product,
                        CaseStatus = getCustomerGetCase.CaseLists[i].Status,
                        CaseSummary = getCustomerGetCase.CaseLists[i].Summary,
                        RegistrationId = getCustomerGetCase.CaseLists[i].Registration_ID.ToString(),
                        SerialNo = getCustomerGetCase.CaseLists[i].Serial_Number,
                        CaseSource = getCustomerGetCase.CaseLists[i].Source,
                        CreatedDate = Convert.ToDateTime(searchByCaseId.Cases.InsertDate),
                        UpdatedDate = Convert.ToDateTime(searchByCaseId.Cases.UpdateDate)
                    });
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerGetCases", "CustomerGetAllCases()", "", ex.Message, ex.StackTrace, "Error");
                return null;
            }
            return caseItems;
        }

        #endregion

        #region Customer Get RMA

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<Rma> CustomerGetRMA(int customerId, string customerEmail, string customerPhoneNo, string customerIsoCountry, int customerExactPhone)
        {
            List<Rma> RMAItems = new List<Rma>();

            try
            {
                CustomerGetRMAType getCustomerGetCaseRMA;


                CaseSearchByCustomerIDType case1 = new CaseSearchByCustomerIDType();
                using (var getServiceClient = new ServicesClient())
                {
                    getCustomerGetCaseRMA = getServiceClient.CustomerGetRMAs(APIService.GetAPIString(), customerId, customerEmail, customerPhoneNo, customerIsoCountry, customerExactPhone);
                    //getCustomerGetCaseRMA = getServiceClient.CustomerGetRMAs(APIService.GetAPIString(), 11957794, "netgear.keteam@csscorp.com", "", "", 0);

                }

                for (int i = 0; i < getCustomerGetCaseRMA.RMALists.Count(); i++)
                {

                    // if (getCustomerGetCaseRMA.RMALists[i].Source == "Online") ??
                    //{
                    RMAItems.Add(new Rma
                    {
                        Created_On = getCustomerGetCaseRMA.RMALists[i].Created_On,
                        Exported_Location = getCustomerGetCaseRMA.RMALists[i].Exported_Location,
                        Exported_On = getCustomerGetCaseRMA.RMALists[i].Exported_On,
                        Exported_Warehouse = getCustomerGetCaseRMA.RMALists[i].Exported_Warehouse,
                        Product = getCustomerGetCaseRMA.RMALists[i].Exported_Warehouse,
                        RMAItem1 = getCustomerGetCaseRMA.RMALists[i].RMAItem1,
                        RMAItem2 = getCustomerGetCaseRMA.RMALists[i].RMAItem2,
                        RMAType = getCustomerGetCaseRMA.RMALists[i].RMAType,
                        RMA_ID = getCustomerGetCaseRMA.RMALists[i].RMA_ID,
                        Registration_ID = getCustomerGetCaseRMA.RMALists[i].Registration_ID,
                        Returned_On = getCustomerGetCaseRMA.RMALists[i].Returned_On,
                        Returned_Product = getCustomerGetCaseRMA.RMALists[i].Returned_Product,
                        Returned_Serial_Number = getCustomerGetCaseRMA.RMALists[i].Returned_Serial_Number,
                        Serial_Number = getCustomerGetCaseRMA.RMALists[i].Serial_Number,
                        Shipped_Courier = getCustomerGetCaseRMA.RMALists[i].Shipped_Courier,
                        Shipped_Courier_Tracking_Number = getCustomerGetCaseRMA.RMALists[i].Shipped_Courier_Tracking_Number,
                        Shipped_On = getCustomerGetCaseRMA.RMALists[i].Shipped_On,
                        Shipped_Product = getCustomerGetCaseRMA.RMALists[i].Shipped_Product,
                        Shipped_Serial_Number = getCustomerGetCaseRMA.RMALists[i].Shipped_Serial_Number,
                        Status = getCustomerGetCaseRMA.RMALists[i].Status,
                        Updated_On = getCustomerGetCaseRMA.RMALists[i].Updated_On,
                    });

                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerGetRMA", "CustomerGetRMA()", "", ex.Message, ex.StackTrace, "Error");
                return null;
            }
            return RMAItems;
        }

        #endregion


        //registrationID
        //caseID
        //apikey
        //Filetype
        //Filename
        //FileSize
        //Description
        //ContentType

        #region "File Upload"

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public int UploadVideo()
        {

            System.IO.Stream str; String strmContents;
            Int32 counter, strLen, strRead;
            var httpRequest = HttpContext.Current.Request;
            int result = -1;
            //str = httpRequest.InputStream;

            //// Find number of bytes in stream.
            //strLen = Convert.ToInt32(str.Length);
            //// Create a byte array.
            //byte[] strArr = new byte[strLen];
            //MemoryStream ms = new MemoryStream(strArr);


            //// Read stream into byte array.
            //strRead = str.Read(strArr, 0, strLen);

            //// Convert byte array to a text string.
            //strmContents = "";
            //for (counter = 0; counter < strLen; counter++)
            //{
            //    strmContents = strmContents + strArr[counter].ToString();
            //}

            if (httpRequest.Files.Count > 0)
            {
                var docfiles = new List<string>();
                var description = httpRequest.Form["description"];
                var caseID = httpRequest.Form["caseID"];
                var registrationID = httpRequest.Form["registrationID"];
                var serialNo = httpRequest.Form["serialNo"];
                var caseType = httpRequest.Form["caseType"];

                //var fileType = httpRequest.
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    strLen = Convert.ToInt32(postedFile.ContentLength);
                    byte[] strArr = new byte[strLen];
                    MemoryStream ms = new MemoryStream(strArr);
                    var conType = postedFile.ContentType;
                    var fileName = postedFile.FileName;
                    var filesize = postedFile.ContentLength;

                    using (var getServiceClient = new ServicesClient())
                    {
                        result = getServiceClient.UploadFileCase(conType, description, filesize, fileName, caseType, "SpeP7uxATasPApa", caseID, registrationID, serialNo, postedFile.InputStream);
                    }
                }
            }
            else
            {
            }
            return result;
        }
        #endregion



        #region Create Cases
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string CreateCase(int customerId, int registrationId, string serialNumber, string caseSummary, string caseProblem, string caseCauses, string caseNotes, string caseSource, string caseAssingTo, int caseQueueId)
        {
            var getCaseCreateType = new CaseCreateType();
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    getCaseCreateType = getServiceClient.CaseCreate(APIService.GetAPIString(), customerId, registrationId, serialNumber, HttpUtility.UrlDecode(caseSummary), HttpUtility.UrlDecode(caseProblem), caseCauses, HttpUtility.UrlDecode(caseNotes), caseSource, caseAssingTo, caseQueueId);
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CreateCase", "CreateCase()", "", ex.Message, ex.StackTrace, "Error");
            }
            return getCaseCreateType.Case_ID.ToString();
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string CreateCases(int customerId, int registrationId, string serialNumber, string caseSummary, string caseProblem, string caseCauses, string caseNotes, string caseSource, string caseAssingTo, int caseQueueId, string caseType)
        {
            var getCaseCreateType = new CaseCreateType();
            caseQueueId = (caseType.ToUpper() == "SCHEDULECALL") ? Convert.ToInt32(ConfigurationManager.AppSettings["ScheduleCallQueueID"].ToString()) : Convert.ToInt32(ConfigurationManager.AppSettings["WebCaseQueueID"].ToString());
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    getCaseCreateType = getServiceClient.CaseCreate(APIService.GetAPIString(), customerId, registrationId, serialNumber, HttpUtility.UrlDecode(caseSummary), HttpUtility.UrlDecode(caseProblem), caseCauses, HttpUtility.UrlDecode(caseNotes), caseSource, caseAssingTo, caseQueueId);
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CreateCase", "CreateCase()", "", ex.Message, ex.StackTrace, "Error");
            }
            return getCaseCreateType.Case_ID.ToString();
        }

        #endregion

        #region Create Customer - Not required
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string CustomerCreate(string firstName, string lastName, string phoneNo, string email, string city, string state, string postCode, string country, bool mailProgram, bool mailPassword, string userPassword, bool betaProgram)
        {
            var createCustomerType = new CustomerCreateType();
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    createCustomerType = getServiceClient.CustomerCreate(APIService.GetAPIString(), "Consumer", string.Empty, firstName, lastName, phoneNo, email, city, state, postCode, country, mailProgram, mailPassword, userPassword, betaProgram);
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerCreate", "CustomerCreate()", "", ex.Message, ex.StackTrace, "Error");
            }
            return createCustomerType.Customer_ID.ToString();
        }

        #endregion

        #region Customer Change Password

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string CustomerChangePassword(int CustomerId, string Email, string NewPassword)
        {
            int getCustomer = 0;
            try
            {
                using (ServicesClient getServiceClient = new ServicesClient())
                {
                    getCustomer = getServiceClient.CustomerChangePassword(APIService.GetAPIString(), CustomerId, Email, NewPassword);
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerChangePassword", "CustomerChangePassword()", "", ex.Message, ex.StackTrace, "Error");
            }
            return getCustomer.ToString();
        }
        //[WebMethod]
        //[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        //public void UninstallTool()
        //{
        //    try
        //    {
        //        dynamic ws = Microsoft.VisualBasic.Interaction.CreateObject("WScript.Shell");
        //        ws.Run("taskkill /f /im Netgear*");
        //        ws.Run("cmd /K CD " + Strings.Chr(34) + "%USERPROFILE%\\Start Menu\\Programs\\Startup" + Strings.Chr(34) + " & del " + Strings.Chr(34) + "Netgear.appref-ms" + Strings.Chr(34), 0, false);
        //        ws.Run("rundll32.exe dfshim.dll,ShArpMaintain Netgear.application, Culture=neutral, PublicKeyToken=17867cde89676018, processorArchitecture=x86");
        //        ws.AppActivate("Netgear");
        //    }
        //    catch (Exception ex)
        //    {
        //        ErrorTracker errorTrace = new ErrorTracker();
        //        errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/UninstallTool", "UninstallTool()", "", ex.Message, ex.StackTrace, "Error");
        //    }
        //}

        //[WebMethod]
        //[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        //public string CustomerChangePassword(int CustomerId, string Email, string NewPassword)
        //{
        //    return "true";
        //}

        #endregion

        #region Customer Forgot Password
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string CustomerForgetPasswordRecovery(string email)
        {
            int getCustomerPassword = 0;
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    getCustomerPassword = getServiceClient.CustomerForgotPassword_Recovery(APIService.GetAPIString(), email);
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerForgetPasswordRecovery", "CustomerForgetPasswordRecovery()", "", ex.Message, ex.StackTrace, "Error");
            }
            return getCustomerPassword.ToString();
        }
        #endregion

        #region Customer Product

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<ProductItems> CustomerGetProduct(int customerId, string customerEmail, string customerPhoneNo, string customerIsoCountry, int customerExactPhone)
        {
            var customerGetProductType = new CustomerGetProductType();
            List<ProductItems> productItems = new List<ProductItems>();
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    customerGetProductType = getServiceClient.CustomerGetProducts(APIService.GetAPIString(), customerId, customerEmail, customerPhoneNo, customerIsoCountry, customerExactPhone);
                }

                for (int i = 0; i < customerGetProductType.RegistrationCount; i++)
                {
                    productItems.Add(new ProductItems
                    {
                        ProductExpired = DateTime.Parse(customerGetProductType.RegistrationLists[i].PsExpiry.ToString()).ToString("MM/dd/yyyy"),
                        CountryPurchase = customerGetProductType.RegistrationLists[i].Country_Purchased,
                        ProductWarranty = customerGetProductType.RegistrationLists[i].Warranty,
                        PurchaseDate = DateTime.Parse(customerGetProductType.RegistrationLists[i].Purchase_Date.ToString()).ToString("MM/dd/yyyy"),
                        RegistrationId = customerGetProductType.RegistrationLists[i].Registration_ID,
                        SerialNo = customerGetProductType.RegistrationLists[i].Serial_Number,
                        SwExpired = customerGetProductType.RegistrationLists[i].SwExpiry.ToString(),
                        ProductName = customerGetProductType.RegistrationLists[i].Product,
                        SWChatExpiry = DateTime.Parse(customerGetProductType.RegistrationLists[i].SWChatExpiry.ToString()).ToString("MM/dd/yyyy"),
                        SWOTSExpiry = DateTime.Parse(customerGetProductType.RegistrationLists[i].SWOTSExpiry.ToString()).ToString("MM/dd/yyyy"),
                        SWPhoneExpiry = DateTime.Parse(customerGetProductType.RegistrationLists[i].SWPhoneExpiry.ToString()).ToString("MM/dd/yyyy"),
                        SupportChatAvailable = Convert.ToBoolean(customerGetProductType.RegistrationLists[i].SupportChatAvailable.ToString()),
                        SupportOTSAvailable = Convert.ToBoolean(customerGetProductType.RegistrationLists[i].SupportOTSAvailable.ToString()),
                        SupportPhoneAvailable = Convert.ToBoolean(customerGetProductType.RegistrationLists[i].SupportPhoneAvailable.ToString())
                    });
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerGetProduct", "CustomerGetProduct()", "", ex.Message, ex.StackTrace, "Error");
            }
            return productItems;
        }

        #endregion

        #region DSL/WiFi Status
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string GetDslWiFiStatus()
        {
            string connected = "false";
            try
            {
                //NetworkInterface[] networkCards = NetworkInterface.GetAllNetworkInterfaces();
                bool network = System.Net.NetworkInformation.NetworkInterface.GetIsNetworkAvailable();
                if (network)
                {
                    connected = "true";
                }
                // Loop through to find the one we want to check for connectivity.
                // Connection can have different numbers appended so check that the 
                // network connections start with the conditions checked below.
                //foreach (NetworkInterface nc in networkCards)
                //{
                //    // Check LAN or Wirless 
                //    if (nc.Name.StartsWith("Local Area Connection") || nc.Name.StartsWith("Wireless Network Connection"))
                //    {
                //        if (network)
                //        {
                //            connected = "true";
                //        }
                //    }
                //}
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/GetDSLWiFiStatus", "GetDSLWiFiStatus()", "", ex.Message, ex.StackTrace, "Error");
            }

            return connected;
        }
        #endregion

        #region Customer Get Contracts

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Xml)]
        public XmlDocument CustomerGetContracts(int customerId)
        {
            var getContractsSearchByCustomer = new ContractsSearchByCustomerID();
            var contractItems = new List<CustomerContractItems>();
            string status = string.Empty;
            try
            {
                getContractsSearchByCustomer = GetContractsbyCustomerId(customerId);

                for (int i = 0; i < getContractsSearchByCustomer.Contracts.Count(); i++)
                {
                    status = getContractsSearchByCustomer.Contracts[i].ExpriyDate > DateTime.Now ? "Active" : "InActive";

                    if (status == "Active")
                    {
                        contractItems.Add(new CustomerContractItems
                                              {
                                                  ContractId =
                                                      getContractsSearchByCustomer.Contracts[i].Contract_ID.ToString(),
                                                  Type = getContractsSearchByCustomer.Contracts[i].Contract_type,
                                                  PurchaseDate =
                                                      getContractsSearchByCustomer.Contracts[i].PurchaseDate.ToString(),
                                                  ExpiryDate =
                                                      getContractsSearchByCustomer.Contracts[i].ExpriyDate.ToString()
                                              });
                    }
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerGetContracts", "CustomerGetContracts()", "", ex.Message, ex.StackTrace, "Error");
            }
            //return caseItems;

            const int page = 1;
            //const int rp = 10;

            var sb = new StringBuilder();
            XmlWriter writer = XmlWriter.Create(sb);
            writer.WriteStartDocument();
            writer.WriteStartElement("CustomerContractItems");
            writer.WriteStartElement("rows");

            writer.WriteStartElement("page");
            writer.WriteValue(page);
            writer.WriteEndElement();

            writer.WriteStartElement("total");
            writer.WriteValue(contractItems.Count.ToString());
            writer.WriteEndElement();

            foreach (var contract in contractItems)
            {
                writer.WriteStartElement("row");
                writer.WriteStartAttribute("id");
                writer.WriteValue(contract.ContractId.ToString());
                writer.WriteEndAttribute();

                writer.WriteStartElement("cell");
                writer.WriteValue(contract.ContractId);
                writer.WriteEndElement();

                writer.WriteStartElement("cell");
                writer.WriteValue(contract.Type);
                writer.WriteEndElement();

                writer.WriteStartElement("cell");
                writer.WriteValue(contract.PurchaseDate);
                writer.WriteEndElement();

                writer.WriteStartElement("cell");
                writer.WriteValue(contract.ExpiryDate);
                writer.WriteEndElement();

                writer.WriteEndElement();
            }

            writer.WriteEndElement();
            writer.WriteEndElement();
            writer.WriteEndDocument();
            writer.Flush();

            var xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(sb.ToString());
            return xmlDocument;

            // XML 
            //const int page = 1;
            //const int rp = 10;

            //var e = new XElement("CustomerContractItems",
            //    new XElement("rows",
            //    new XElement("page", page.ToString()),
            //    new XElement("total", contractItems.Count.ToString()),
            //       (from r in contractItems
            //        select new XElement("row", new XAttribute("id", r.ContractId),
            //                                   new XElement("cell", r.ContractId),
            //                                   new XElement("cell", r.Type),
            //                                   new XElement("cell", r.PurchaseDate),
            //                                   new XElement("cell", r.ExpiryDate)
            //        )).Skip((page - 1) * rp).Take(rp)
            //    ));

            //return e;

        }

        #endregion

        #region public XmlDocument CustomerGetScheduleCases(int customerId, string customerEmail, string customerPhoneNo, string customerIsoCountry, int customerExactPhone)

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Xml)]
        //public XmlDocument CustomerGetScheduleCases(int customerId, string customerEmail, string customerPhoneNo, string customerIsoCountry, int customerExactPhone)
        public XmlDocument CustomerGetScheduleCases(int customerId)
        {
            var caseItems = new List<CaseItems>();
            //2951402

            try
            {
                CustomerGetCaseType getCustomerGetCase;
                using (var getServiceClient = new ServicesClient())
                {
                    //getCustomerGetCase = getServiceClient.CustomerGetCases(APIService.GetAPIString(), customerId, customerEmail, customerPhoneNo, customerIsoCountry, customerExactPhone);
                    getCustomerGetCase = getServiceClient.CustomerGetCases(APIService.GetAPIString(), customerId, "", "", "", 0);
                }

                for (int i = 0; i < getCustomerGetCase.CaseLists.Count(); i++)
                {


                    //"§" + $("#txtDate").val() + "§" + $("#txtTime").val() + "§" + $("#txtTimeZone").val() + "§" + $("#txtPhoneNumber").val();
                    if (getCustomerGetCase.CaseLists[i].Source == "Phone")
                    {
                        //const string newCaseSummary = "§21/2/2012§11:30PM§GMT§9838383838";
                        string newCaseSummary = getCustomerGetCase.CaseLists[i].Summary;
                        string[] caseSummary = newCaseSummary.Split('§');
                        string date = caseSummary[1];
                        string time = caseSummary[2];
                        string stamp = caseSummary[3];
                        string phone = caseSummary[4];

                        caseItems.Add(new CaseItems
                                              {
                                                  //CaseId = getCustomerGetCase.CaseLists[1].Case_ID,
                                                  CaseId = getCustomerGetCase.CaseLists[i].Case_ID,
                                                  CaseNo = getCustomerGetCase.CaseLists[i].Case_ID,
                                                  CaseProduct = getCustomerGetCase.CaseLists[i].Product,
                                                  CaseStatus = getCustomerGetCase.CaseLists[i].Status,
                                                  //CaseSummary = getCustomerGetCase.CaseLists[i].Summary
                                                  ScheduleDate = date,
                                                  ScheduleTime = time,
                                                  ScheduleTimeStamp = stamp,
                                                  Phone = phone
                                              });
                    }

                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerGetCases", "CustomerGetCases()", "", ex.Message, ex.StackTrace, "Error");
            }
            //return caseItems;


            const int page = 1;
            //const int rp = 10;

            var sb = new StringBuilder();
            XmlWriter writer = XmlWriter.Create(sb);
            writer.WriteStartDocument();
            writer.WriteStartElement("CaseItems");
            writer.WriteStartElement("rows");

            writer.WriteStartElement("page");
            writer.WriteValue(page);
            writer.WriteEndElement();

            writer.WriteStartElement("total");
            writer.WriteValue(caseItems.Count.ToString());
            writer.WriteEndElement();

            foreach (var cases in caseItems)
            {
                writer.WriteStartElement("row");
                writer.WriteStartAttribute("id");
                writer.WriteValue(cases.CaseId.ToString());
                writer.WriteEndAttribute();

                writer.WriteStartElement("cell");
                writer.WriteValue(cases.CaseId);
                writer.WriteEndElement();

                writer.WriteStartElement("cell");
                writer.WriteValue(cases.CaseProduct);
                writer.WriteEndElement();

                //writer.WriteStartElement("cell");
                //writer.WriteValue(cases.CaseSummary);
                //writer.WriteEndElement();

                writer.WriteStartElement("cell");
                writer.WriteValue(cases.CaseStatus);
                writer.WriteEndElement();

                writer.WriteStartElement("cell");
                writer.WriteValue(cases.ScheduleDate);
                writer.WriteEndElement();

                writer.WriteStartElement("cell");
                writer.WriteValue(cases.ScheduleTime);
                writer.WriteEndElement();

                writer.WriteEndElement();
            }

            writer.WriteEndElement();
            writer.WriteEndElement();
            writer.WriteEndDocument();
            writer.Flush();

            var xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(sb.ToString());
            return xmlDocument;


            // XML 
            //const int page = 1;
            //const int rp = 10;

            //var e = new XElement("CaseItems",
            //    new XElement("rows",
            //    new XElement("page", page.ToString()),
            //    new XElement("total", caseItems.Count.ToString()),
            //       (from r in caseItems
            //        select new XElement("row", new XAttribute("id", r.CaseId.ToString()),
            //                                   new XElement("cell", r.CaseId.ToString()),
            //                                   new XElement("cell", r.CaseProduct),
            //                                   //new XElement("cell", r.CaseSummary),
            //                                   new XElement("cell", r.CaseStatus),
            //                                   new XElement("cell", r.ScheduleDate),
            //                                   new XElement("cell", r.ScheduleTime)
            //        )).Skip((page - 1) * rp).Take(rp)
            //    ));

            //return e;

        }

        #endregion

        #region public List<CaseItems> MyScheduleCases(int customerId)
        [WebMethod]
        public List<CaseItems> MyScheduleCases(int customerId)
        {
            var caseItems = new List<CaseItems>();
            CustomerGetCaseType getCustomerGetCase = new CustomerGetCaseType();
            string date = string.Empty;
            string time = string.Empty;
            string stamp = string.Empty;
            string phone = string.Empty;
            string summary = string.Empty;
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    getCustomerGetCase = getServiceClient.CustomerGetCases(APIService.GetAPIString(), customerId, "", "", "", 0);
                }

                try
                {
                    for (int i = 0; i < getCustomerGetCase.CaseLists.Count(); i++)
                    {
                        if (getCustomerGetCase.CaseLists[i].Source == "Phone")
                        {
                            string newCaseSummary = getCustomerGetCase.CaseLists[i].Summary;
                            string[] caseSummary = newCaseSummary.Split('§');

                            if (caseSummary.Count() <= 1)
                            {
                                caseSummary = newCaseSummary.Split(',');
                                date = caseSummary[0];
                                time = caseSummary[1];
                                stamp = caseSummary[2];
                                phone = caseSummary[3];
                                summary = string.Empty;
                                summary = (i == 4) ? "My Schedule" : caseSummary[4];
                            }
                            else
                            {
                                date = caseSummary[1];
                                time = caseSummary[2];
                                stamp = caseSummary[3];
                                phone = caseSummary[4];
                                summary = string.Empty;
                                summary = (i == 5) ? "My Schedule" : caseSummary[5];
                            }

                            caseItems.Add(new CaseItems
                            {
                                CaseId = getCustomerGetCase.CaseLists[i].Case_ID,
                                CaseNo = getCustomerGetCase.CaseLists[i].Case_ID,
                                CaseProduct = getCustomerGetCase.CaseLists[i].Product,
                                CaseStatus = getCustomerGetCase.CaseLists[i].Status,
                                CaseSummary = summary,
                                ScheduleDate = date,
                                ScheduleTime = time,
                                ScheduleTimeStamp = stamp,
                                Phone = phone
                            });
                        }

                    }
                }
                catch (Exception ex)
                {
                    var errorTrace = new ErrorTracker();
                    errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerGetCases", "CustomerGetCases() - Sceduled Cases", "", ex.Message, ex.StackTrace, "Error");
                }

                MessageCenterClient messageCenterClient = new MessageCenterClient();
                var lstCustomerTaskClass = messageCenterClient.GetCustomerTask(customerId.ToString(), "1");

                if (lstCustomerTaskClass != null)
                {
                    for (int i = 0; i < lstCustomerTaskClass.Length; i++)
                    {
                        caseItems.Add(new CaseItems
                            {
                                CaseSummary = lstCustomerTaskClass[i].Task,
                                ScheduleDate = lstCustomerTaskClass[i].StartDate,
                            });
                    }
                }

            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/CustomerGetCases", "CustomerGetCases()", "", ex.Message, ex.StackTrace, "Error");
            }
            return caseItems;
        }
        #endregion

        #region public XmlDocument CustomerGetContractsByContractId(int customerId, int contractId)
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<CustomerContractItems> CustomerGetContractsByContractId(int customerId, int contractId)
        {
            ContractsSearchWithCustomer getContractCustomer = new ContractsSearchWithCustomer();
            List<CustomerContractItems> contractItems = new List<CustomerContractItems>();
            string ContractType = string.Empty;

            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    getContractCustomer = getServiceClient.CustomerGetContracts(APIService.GetAPIString(), customerId).Contracts.FirstOrDefault(cont => cont.Contract_ID == contractId);
                }
                if (getContractCustomer != null)
                {
                    ContractType = getContractCustomer.Contract_type;
                }
                //ContractType = "<a href='#' title ='" + ContractType + "' style='color:#000; text-decoration:none'>" + ContractType + "</a>";
                if (getContractCustomer != null)
                    contractItems.Add(new CustomerContractItems
                                          {
                                              ContractId = getContractCustomer.Contract_ID.ToString(),
                                              Type = ContractType,
                                              PurchaseDate = getContractCustomer.PurchaseDate.ToString(),
                                              ExpiryDate = getContractCustomer.ExpriyDate.ToString(),
                                          });

            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/GetContractsbyCustomerID", "CustomerGetContractsId()", "", ex.Message, ex.StackTrace, "Error");
            }
            return contractItems;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string CustomerGetSubscriptionProduct(int customerId, int contractId, string customerEmail)
        {
            ContractsSearchWithCustomer getContractCustomer = new ContractsSearchWithCustomer();
            List<CustomerContractItems> contractItems = new List<CustomerContractItems>();
            var customerGetProductType = new CustomerGetProductType();
            string strProductName = string.Empty;

            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    getContractCustomer = getServiceClient.CustomerGetContracts(APIService.GetAPIString(), customerId).Contracts.FirstOrDefault(cont => cont.Contract_ID == contractId);
                }
                //ContractType = "<a href='#' title ='" + ContractType + "' style='color:#000; text-decoration:none'>" + ContractType + "</a>";
                int registrationID = 0;
                if (getContractCustomer != null)
                {
                    registrationID = getContractCustomer.Registration_ID;
                }
                using (var getServiceClient = new ServicesClient())
                {
                    customerGetProductType = getServiceClient.CustomerGetProducts(APIService.GetAPIString(), customerId, customerEmail, string.Empty, string.Empty, 0);
                }

                for (int i = 0; i < customerGetProductType.RegistrationCount; i++)
                {
                    if (customerGetProductType.RegistrationLists[i].Registration_ID == registrationID)
                    {
                        strProductName = customerGetProductType.RegistrationLists[i].Product;
                    }
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/GetContractsbyCustomerID", "CustomerGetContractsId()", "", ex.Message, ex.StackTrace, "Error");
            }
            return strProductName;
        }
        #endregion

        #region public List<ContractsSearchWithCustomer> CustomerGetContractsId(int customerId)
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<ContractsSearchWithCustomer> CustomerGetContractsId(int customerId)
        {
            var getContractSearchType = new ContractsSearchWithCustomer();
            var contractItems = new List<ContractsSearchWithCustomer>();
            //CustomerSearchType getCusomerSearchType;
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    ContractsSearchWithCustomer[] ss = getServiceClient.CustomerGetContracts(APIService.GetAPIString(), customerId).Contracts;
                    contractItems = getServiceClient.CustomerGetContracts(APIService.GetAPIString(), customerId).Contracts.Where(cont => cont.ExpriyDate >= DateTime.Now).OrderByDescending(cont => cont.Contract_ID).Take(1).ToList();

                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/GetContractsbyCustomerID", "CustomerGetContractsId()", "", ex.Message, ex.StackTrace, "Error");
            }
            return contractItems;
        }
        #endregion

        #region Check Contracts Availability by Customer Id ()

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public ContractInfo GetContractsAvailabilitybyCustomerId(int customerId)
        {
            ContractInfo contract = new ContractInfo();
            int countContract = 0;
            var contractItems = new List<ContractsSearchWithCustomer>();
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    //getContractSearchType = getServiceClient.CustomerGetContracts(APIService.GetAPIString(), customerId);

                    //contractItems = getServiceClient.CustomerGetContracts(APIService.GetAPIString(), customerId).Contracts.OrderByDescending(cont => cont.Contract_ID).Take(1).ToList();  //Code Commented on 17/11/2014 Contract Status Issue

                    contractItems = getServiceClient.CustomerGetContracts(APIService.GetAPIString(), customerId).Contracts.OrderByDescending(cont => cont.ExpriyDate).Take(1).ToList();  //Code modified on 17/11/2014 Contract Status Issue
                    countContract = contractItems.Count;
                    if (countContract > 0)
                    {
                        DateTime expiryDate = Convert.ToDateTime(contractItems.Single().ExpriyDate);
                        DateTime today = System.DateTime.Now;
                        int remainingDays = Convert.ToInt16((expiryDate - today).TotalDays);
                        //contract.ContractAvailability = countContract;    //Code Commented on 06/11/2014 Contract Status Issue
                        contract.ContractAvailability = (remainingDays >= 0) ? 1 : 0;   //Code added on 06/11/2014 Contract Status Issue
                        contract.RemainingDays = remainingDays;
                        contract.ContractId = contractItems.Single().Contract_ID;
                    }
                }
            }
            catch (Exception ex)
            {
                var errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/GetContractsbyCustomerID", "GetContractsbyCustomerID()", "", ex.Message, ex.StackTrace, "Error");
            }
            return contract;
        }

        #endregion

        //#region public ProductItems CustomerGetProduct(int customerId)
        //[WebMethod]
        //[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        //public CustomerGetProductType CustomerGetProduct(int customerId)
        //{
        //    var productItems = new List<ProductItems>();
        //    var customerGetProductType = new CustomerGetProductType();
        //    try
        //    {
        //        using (var getServiceClient = new ServicesClient())
        //        {
        //            customerGetProductType = getServiceClient.CustomerGetProducts(APIService.GetAPIString(), customerId, string.Empty, string.Empty, string.Empty, 0);
        //        }

        //        for (int i = 0; i < customerGetProductType.RegistrationCount; i++)
        //        {
        //            productItems.Add(new ProductItems
        //            {
        //                CountryPurchase = customerGetProductType.RegistrationLists[i].Country_Purchased,
        //                ProductExpired = customerGetProductType.RegistrationLists[i].PsExpiry.ToString(),
        //                ProductWarranty = customerGetProductType.RegistrationLists[i].Warranty,
        //                PurchaseDate = customerGetProductType.RegistrationLists[i].Purchase_Date.ToString(),
        //                RegistrationId = customerGetProductType.RegistrationLists[i].Registration_ID,
        //                SerialNo = customerGetProductType.RegistrationLists[i].Serial_Number,
        //                SwExpired = customerGetProductType.RegistrationLists[i].SwExpiry.ToString(),
        //                ProductName = customerGetProductType.RegistrationLists[i].Product

        //            });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        var errorTrace = new ErrorTracker();
        //        errorTrace.WriteErrorLog("NetgearClientService.asmx.cs/GetContractsbyCustomerID", "CustomerGetContractsId()", "", ex.Message, ex.StackTrace, "Error");
        //    }
        //    return customerGetProductType;
        //}
        //#endregion

        #region public List<RegistrationSearch> CustomerGetProductInfo(int customerId)
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<RegistrationSearch> CustomerGetProductInfo(int customerId)
        {
            ProductItems product = new ProductItems();
            var productItems = new List<RegistrationSearch>();
            using (var getServiceClient = new ServicesClient())
            {
                productItems = getServiceClient.CustomerGetProducts(APIService.GetAPIString(), customerId, string.Empty, string.Empty, string.Empty, 0).RegistrationLists.ToList();
                //if (productItems.Count > 0)
                //{
                //    foreach (var myProduct in productItems)
                //    {
                //        product.SerialNo = myProduct.Serial_Number;
                //        product.ProductName = myProduct.Product;
                //    }
                //}
            }
            return productItems;
        }
        #endregion

        #region Establishing the Port Connection
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public bool ScanPort()
        {
            bool status = false;
            foreach (string hostname in System.Configuration.ConfigurationManager.AppSettings["HostIp"].ToString().Split(','))
            {
                try
                {
                    int portno = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["HostPort"].ToString());

                    IPAddress ipa = (IPAddress)Dns.GetHostAddresses(hostname)[0];
                    try
                    {
                        System.Net.Sockets.Socket sock =
                            new System.Net.Sockets.Socket(ipa.AddressFamily,
                                                          System.Net.Sockets.SocketType.Stream,
                                                          System.Net.Sockets.ProtocolType.Tcp);
                        sock.Connect(ipa, portno);
                        if (sock.Connected == true) // Port is in use and connection is successful
                            status = true;
                        return status;
                    }
                    catch (System.Net.Sockets.SocketException ex)
                    {
                        if (ex.ErrorCode == 10060) // Port is unused and could not establish connection                
                            status = false;

                    }
                }
                catch (Exception)
                {
                    status = false;
                }
            }
            return status;
        }
        #endregion

        #region "NG Analytics Database"
        [WebMethod]
        public string GetNetgearToolUniqueID()
        {
            try
            {
                return Guid.NewGuid().ToString();
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetNetgearToolUniqueID()", "", ex.Message, ex.StackTrace, "Error");
                if (ex.InnerException != null)
                {
                    errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetNetgearToolUniqueID()", "", ex.InnerException.Message, ex.InnerException.StackTrace, "Error : InnerException");
                }
                errorTrace = null;
                return null;
            }
        }

        [WebMethod]
        public void NetgearToolDownloadDetails()
        {
            try
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteLog("======================================================================================");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: UpdateNetgearToolDownloadDetails() method was invoked.");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: UpdateNetgearToolDownloadDetails() :: Initializing AnalyticsDBDataContext Entity Framework.");

                NGStatusEntities analyticsDBDataContext = new NGStatusEntities();
                NGDownloadStatus_History ngDownloadStatus_History = new NGDownloadStatus_History();

                ngDownloadStatus_History.UniqueID = Guid.NewGuid().ToString();
                ngDownloadStatus_History.LoginID = "Downloads";
                ngDownloadStatus_History.UpdatedDate = DateTime.Now;

                analyticsDBDataContext.NGDownloadStatus_History.AddObject(ngDownloadStatus_History);
                analyticsDBDataContext.SaveChanges();

                analyticsDBDataContext.Dispose();
                ngDownloadStatus_History = null;

                errorTrace.WriteLog("NetgearClientService.asmx.cs :: UpdateNetgearToolDownloadDetails() method invocation completed");
                errorTrace = null;
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "UpdateNetgearToolDownloadDetails()", "", ex.Message, ex.StackTrace, "Error");
                if (ex.InnerException != null)
                {
                    errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetNetgearToolUniqueID()", "", ex.InnerException.Message, ex.InnerException.StackTrace, "Error : InnerException");
                }
                errorTrace = null;
            }
        }

        [WebMethod]
        public void NetgearToolInstallationDetails(string uniqueID, string loginID, string initialVersion, DateTime installationdate)
        {
            try
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteLog("================================================================================");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolInstallationDetails() method was invoked.");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolInstallationDetails() :: Initializing AnalyticsDBDataContext Entity Framework.");
                NGStatusEntities analyticsDBDataContext = new NGStatusEntities();

                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolInstallationDetails() :: Checking for existing record for uniqueID : " + uniqueID);
                NGDownloadStatus ngDownloadStatus = analyticsDBDataContext.NGDownloadStatus.SingleOrDefault(dsl => (dsl.UniqueID.Equals(uniqueID)));

                if (ngDownloadStatus == null)
                {
                    errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolInstallationDetails() :: Record not exists for uniqueID : " + uniqueID);
                    ngDownloadStatus = new NGDownloadStatus();

                    ngDownloadStatus.UniqueID = uniqueID;
                    ngDownloadStatus.LoginID = loginID;
                    ngDownloadStatus.InitialVersion = initialVersion;
                    ngDownloadStatus.InstallationDate = installationdate;
                    ngDownloadStatus.IsUpdated = false;
                    ngDownloadStatus.ToolUpdatedDate = null;
                    ngDownloadStatus.LastVersion = null;
                    ngDownloadStatus.CurrentVersion = null;
                    ngDownloadStatus.IsUninstall = false;
                    ngDownloadStatus.UninstallDate = null;

                    analyticsDBDataContext.NGDownloadStatus.AddObject(ngDownloadStatus);
                    analyticsDBDataContext.SaveChanges();

                    NGDownloadStatus_History ngDownloadStatus_History = new NGDownloadStatus_History();
                    ngDownloadStatus_History.UniqueID = uniqueID;
                    ngDownloadStatus_History.LoginID = loginID;
                    ngDownloadStatus_History.InitialVersion = initialVersion;
                    ngDownloadStatus_History.InstallationDate = installationdate;
                    ngDownloadStatus_History.IsUpdated = false;
                    ngDownloadStatus_History.ToolUpdatedDate = null;
                    ngDownloadStatus_History.LastVersion = null;
                    ngDownloadStatus_History.CurrentVersion = null;
                    ngDownloadStatus_History.IsUninstall = false;
                    ngDownloadStatus_History.UninstallDate = null;
                    ngDownloadStatus_History.UpdatedDate = installationdate;
                    analyticsDBDataContext.NGDownloadStatus_History.AddObject(ngDownloadStatus_History);
                    analyticsDBDataContext.SaveChanges();
                }
                else
                {
                    errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolInstallationDetails() :: Record exists for uniqueID : " + uniqueID + " and CurrentVersion : " + initialVersion);

                    if (ngDownloadStatus.IsUpdated == false)
                    {
                        ngDownloadStatus.IsUpdated = true;
                        ngDownloadStatus.ToolUpdatedDate = installationdate;
                        ngDownloadStatus.LastVersion = ngDownloadStatus.InitialVersion;
                        ngDownloadStatus.CurrentVersion = initialVersion;
                        ngDownloadStatus.IsUninstall = false;
                        ngDownloadStatus.UninstallDate = null;
                        analyticsDBDataContext.SaveChanges();

                        NGDownloadStatus_History ngDownloadStatus_History = new NGDownloadStatus_History();
                        ngDownloadStatus_History.UniqueID = uniqueID;
                        ngDownloadStatus_History.LoginID = loginID;
                        ngDownloadStatus_History.InitialVersion = null;
                        ngDownloadStatus_History.InstallationDate = null;
                        ngDownloadStatus_History.IsUpdated = true;
                        ngDownloadStatus_History.ToolUpdatedDate = installationdate;
                        ngDownloadStatus_History.LastVersion = ngDownloadStatus.InitialVersion;
                        ngDownloadStatus_History.CurrentVersion = initialVersion;
                        ngDownloadStatus_History.IsUninstall = false;
                        ngDownloadStatus_History.UninstallDate = null;
                        ngDownloadStatus_History.UpdatedDate = installationdate;
                        analyticsDBDataContext.NGDownloadStatus_History.AddObject(ngDownloadStatus_History);
                        analyticsDBDataContext.SaveChanges();
                    }
                    else
                    {
                        string currentVersion = ngDownloadStatus.CurrentVersion;

                        ngDownloadStatus.IsUpdated = true;
                        ngDownloadStatus.ToolUpdatedDate = installationdate;
                        ngDownloadStatus.LastVersion = currentVersion;
                        ngDownloadStatus.CurrentVersion = initialVersion;
                        ngDownloadStatus.IsUninstall = false;
                        ngDownloadStatus.UninstallDate = null;
                        analyticsDBDataContext.SaveChanges();

                        NGDownloadStatus_History ngDownloadStatus_History = new NGDownloadStatus_History();
                        ngDownloadStatus_History.UniqueID = uniqueID;
                        ngDownloadStatus_History.LoginID = loginID;
                        ngDownloadStatus_History.InitialVersion = null;
                        ngDownloadStatus_History.InstallationDate = null;
                        ngDownloadStatus_History.IsUpdated = true;
                        ngDownloadStatus_History.ToolUpdatedDate = installationdate;
                        ngDownloadStatus_History.LastVersion = currentVersion;
                        ngDownloadStatus_History.CurrentVersion = initialVersion;
                        ngDownloadStatus_History.IsUninstall = false;
                        ngDownloadStatus_History.UninstallDate = null;
                        ngDownloadStatus_History.UpdatedDate = installationdate;
                        analyticsDBDataContext.NGDownloadStatus_History.AddObject(ngDownloadStatus_History);
                        analyticsDBDataContext.SaveChanges();
                    }
                }

                analyticsDBDataContext.Dispose();
                ngDownloadStatus = null;

                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolInstallationDetails() :: Record updated for uniqueID : " + uniqueID + " and CurrentVersion : " + initialVersion);

                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolInstallationDetails() method invocation completed");
                errorTrace = null;
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "NetgearToolInstallationDetails()", "", ex.Message, ex.StackTrace, "Error");
                if (ex.InnerException != null)
                {
                    errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetNetgearToolUniqueID()", "", ex.InnerException.Message, ex.InnerException.StackTrace, "Error : InnerException");
                }
                errorTrace = null;
            }
        }

        [WebMethod]
        public void NetgearToolCurrentVersionDetails(string uniqueID, string loginID, string lastVersion, string currentVersion, DateTime updateddate)
        {
            try
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteLog("================================================================================");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolCurrentVersionDetails() method was invoked.");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolCurrentVersionDetails() :: Initializing AnalyticsDBDataContext Entity Framework.");
                NGStatusEntities analyticsDBDataContext = new NGStatusEntities();

                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolCurrentVersionDetails() :: Checking for existing record for uniqueID : " + uniqueID + " and UpdatedVersion : " + currentVersion);
                NGDownloadStatus ngDownloadStatus = analyticsDBDataContext.NGDownloadStatus.SingleOrDefault(dsl => (dsl.UniqueID.Equals(uniqueID)));

                if (ngDownloadStatus != null && ngDownloadStatus.InitialVersion.Equals(currentVersion) == false)
                {
                    errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolCurrentVersionDetails() :: Record exists for uniqueID : " + uniqueID + " and UpdatedVersion : " + currentVersion);
                    ngDownloadStatus.UniqueID = uniqueID;
                    ngDownloadStatus.IsUpdated = true;
                    ngDownloadStatus.ToolUpdatedDate = updateddate;
                    ngDownloadStatus.LastVersion = lastVersion;
                    ngDownloadStatus.CurrentVersion = currentVersion;

                    analyticsDBDataContext.SaveChanges();

                    errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolCurrentVersionDetails() :: Record updated for uniqueID : " + uniqueID + " and with UpdatedVersion : " + currentVersion);

                    NGDownloadStatus_History ngDownloadStatus_History = new NGDownloadStatus_History();
                    ngDownloadStatus_History.UniqueID = uniqueID;
                    ngDownloadStatus_History.LoginID = loginID;
                    ngDownloadStatus_History.InitialVersion = null;
                    ngDownloadStatus_History.InstallationDate = null;
                    ngDownloadStatus_History.IsUpdated = true;
                    ngDownloadStatus_History.ToolUpdatedDate = updateddate;
                    ngDownloadStatus_History.LastVersion = lastVersion;
                    ngDownloadStatus_History.CurrentVersion = currentVersion;
                    ngDownloadStatus_History.IsUninstall = false;
                    ngDownloadStatus_History.UninstallDate = null;
                    ngDownloadStatus_History.UpdatedDate = updateddate;
                    analyticsDBDataContext.NGDownloadStatus_History.AddObject(ngDownloadStatus_History);
                    analyticsDBDataContext.SaveChanges();
                    ngDownloadStatus_History = null;
                }
                else if (ngDownloadStatus == null)
                {
                    ngDownloadStatus = new NGDownloadStatus();
                    ngDownloadStatus.UniqueID = uniqueID;
                    ngDownloadStatus.LoginID = loginID;
                    ngDownloadStatus.InitialVersion = lastVersion;
                    ngDownloadStatus.IsUpdated = true;
                    ngDownloadStatus.ToolUpdatedDate = updateddate;
                    ngDownloadStatus.LastVersion = lastVersion;
                    ngDownloadStatus.CurrentVersion = currentVersion;

                    analyticsDBDataContext.NGDownloadStatus.AddObject(ngDownloadStatus);
                    analyticsDBDataContext.SaveChanges();

                    errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolCurrentVersionDetails() :: Record not exists for uniqueID : " + uniqueID + " and UpdatedVersion : " + currentVersion);

                    NGDownloadStatus_History ngDownloadStatus_History = new NGDownloadStatus_History();
                    ngDownloadStatus_History.UniqueID = uniqueID;
                    ngDownloadStatus_History.LoginID = loginID;
                    ngDownloadStatus_History.InitialVersion = lastVersion;
                    ngDownloadStatus_History.InstallationDate = null;
                    ngDownloadStatus_History.IsUpdated = true;
                    ngDownloadStatus_History.ToolUpdatedDate = updateddate;
                    ngDownloadStatus_History.LastVersion = lastVersion;
                    ngDownloadStatus_History.CurrentVersion = currentVersion;
                    ngDownloadStatus_History.IsUninstall = false;
                    ngDownloadStatus_History.UninstallDate = null;
                    ngDownloadStatus_History.UpdatedDate = updateddate;
                    analyticsDBDataContext.NGDownloadStatus_History.AddObject(ngDownloadStatus_History);
                    analyticsDBDataContext.SaveChanges();
                    ngDownloadStatus_History = null;
                }

                analyticsDBDataContext.Dispose();
                ngDownloadStatus = null;

                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolCurrentVersionDetails() method invocation completed");
                errorTrace = null;
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "NetgearToolCurrentVersionDetails()", "", ex.Message, ex.StackTrace, "Error");
                if (ex.InnerException != null)
                {
                    errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetNetgearToolUniqueID()", "", ex.InnerException.Message, ex.InnerException.StackTrace, "Error : InnerException");
                }
                errorTrace = null;
            }
        }

        [WebMethod]
        public void NetgearToolUninstallationDetails(string uniqueID, string loginID, DateTime uninstallationdate)
        {
            try
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteLog("================================================================================");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolUninstallationDetails() method was invoked.");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolUninstallationDetails() :: Initializing AnalyticsDBDataContext Entity Framework.");
                NGStatusEntities analyticsDBDataContext = new NGStatusEntities();

                NGDownloadStatus ngDownloadStatus = analyticsDBDataContext.NGDownloadStatus.SingleOrDefault(dsl => (dsl.UniqueID.Equals(uniqueID)));

                if (ngDownloadStatus != null)
                {
                    errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolUninstallationDetails() :: Record exists for UniqueID : " + uniqueID);
                    ngDownloadStatus.IsUninstall = true;
                    ngDownloadStatus.UninstallDate = uninstallationdate;
                    analyticsDBDataContext.SaveChanges();
                    errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolUninstallationDetails() :: Record updated for UniqueID : " + uniqueID + " . Set true to ISUnistall and UninstallDate as " + uninstallationdate.ToString());
                }
                else
                {
                    errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolUninstallationDetails() :: Record not exists for UniqueID : " + uniqueID);
                    ngDownloadStatus = new NGDownloadStatus();
                    ngDownloadStatus.UniqueID = uniqueID;
                    ngDownloadStatus.LoginID = loginID;
                    ngDownloadStatus.IsUninstall = true;
                    ngDownloadStatus.UninstallDate = uninstallationdate;

                    analyticsDBDataContext.NGDownloadStatus.AddObject(ngDownloadStatus);
                    analyticsDBDataContext.SaveChanges();
                    errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolUninstallationDetails() :: Record updated for UniqueID : " + uniqueID + " . Set true to ISUnistall and UninstallDate as " + uninstallationdate.ToString());
                }

                NGDownloadStatus_History ngDownloadStatus_History = new NGDownloadStatus_History();
                ngDownloadStatus_History.UniqueID = uniqueID;
                ngDownloadStatus_History.LoginID = loginID;
                ngDownloadStatus_History.InitialVersion = null;
                ngDownloadStatus_History.InstallationDate = null;
                ngDownloadStatus_History.IsUpdated = false;
                ngDownloadStatus_History.ToolUpdatedDate = null;
                ngDownloadStatus_History.LastVersion = null;
                ngDownloadStatus_History.CurrentVersion = null;
                ngDownloadStatus_History.IsUninstall = true;
                ngDownloadStatus_History.UninstallDate = uninstallationdate;
                ngDownloadStatus_History.UpdatedDate = uninstallationdate;
                analyticsDBDataContext.NGDownloadStatus_History.AddObject(ngDownloadStatus_History);
                analyticsDBDataContext.SaveChanges();

                analyticsDBDataContext.Dispose();
                ngDownloadStatus = null;
                ngDownloadStatus_History = null;

                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolUninstallationDetails() method invocation completed");
                errorTrace = null;
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "NetgearToolUninstallationDetails()", "", ex.Message, ex.StackTrace, "Error");
                if (ex.InnerException != null)
                {
                    errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetNetgearToolUniqueID()", "", ex.InnerException.Message, ex.InnerException.StackTrace, "Error : InnerException");
                }
                errorTrace = null;
            }
        }

        [WebMethod]
        public void NetgearToolLoginDetails(string uniqueID, string loginID, DateTime updatedDate)
        {
            try
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteLog("================================================================================");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolLoginDetails() method was invoked.");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolLoginDetails() :: Initializing AnalyticsDBDataContext Entity Framework.");
                NGStatusEntities analyticsDBDataContext = new NGStatusEntities();

                NGDownloadStatus ngDownloadStatus = analyticsDBDataContext.NGDownloadStatus.SingleOrDefault(dsl => (dsl.UniqueID.Equals(uniqueID)));

                if (ngDownloadStatus != null)
                {
                    errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolLoginDetails() :: Record exists for UniqueID : " + uniqueID);
                    ngDownloadStatus.LoginID = loginID;

                    analyticsDBDataContext.SaveChanges();
                    errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolLoginDetails() :: Record updated for UniqueID : " + uniqueID);
                }
                else if (ngDownloadStatus == null)
                {
                    errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolLoginDetails() :: Record not exists for UniqueID : " + uniqueID);
                }


                NGDownloadStatus_History ngDownloadStatus_History = new NGDownloadStatus_History();
                ngDownloadStatus_History.UniqueID = uniqueID;
                ngDownloadStatus_History.LoginID = loginID;
                ngDownloadStatus_History.InitialVersion = null;
                ngDownloadStatus_History.InstallationDate = null;
                ngDownloadStatus_History.IsUpdated = false;
                ngDownloadStatus_History.ToolUpdatedDate = null;
                ngDownloadStatus_History.LastVersion = null;
                ngDownloadStatus_History.CurrentVersion = null;
                ngDownloadStatus_History.IsUninstall = false;
                ngDownloadStatus_History.UninstallDate = null;
                ngDownloadStatus_History.UpdatedDate = updatedDate;
                analyticsDBDataContext.NGDownloadStatus_History.AddObject(ngDownloadStatus_History);
                analyticsDBDataContext.SaveChanges();

                analyticsDBDataContext.Dispose();
                ngDownloadStatus = null;
                ngDownloadStatus_History = null;

                errorTrace.WriteLog("NetgearClientService.asmx.cs :: NetgearToolLoginDetails() method invocation completed");
                errorTrace = null;
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "NetgearToolLoginDetails()", "", ex.Message, ex.StackTrace, "Error");
                if (ex.InnerException != null)
                {
                    errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetNetgearToolUniqueID()", "", ex.InnerException.Message, ex.InnerException.StackTrace, "Error : InnerException");
                }
                errorTrace = null;
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Xml)]
        public XmlDocument GetNGToolDownloadDetails()
        {
            try
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteLog("================================================================================");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: GetNGToolDownloadDetails() method was invoked.");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: GetNGToolDownloadDetails() :: Initializing AnalyticsDBDataContext Entity Framework.");
                NGStatusEntities analyticsDBDataContext = new NGStatusEntities();


                string totalDownloads = analyticsDBDataContext.NGDownloadStatus.ToList().Count.ToString();

                XElement downloads = new XElement("Downloads",
                            new XElement("TotalDownloads", totalDownloads),
                        from downloadStatus in analyticsDBDataContext.NGDownloadStatus.ToList()
                        orderby downloadStatus.ID
                        select new XElement("Download",
                            new XElement("ID", downloadStatus.ID.ToString()),
                            new XElement("UniqueID", downloadStatus.UniqueID),
                            new XElement("LoginID", downloadStatus.LoginID),
                            new XElement("InitialVersion", downloadStatus.InitialVersion),
                            new XElement("InstallationDate", downloadStatus.InstallationDate),
                            new XElement("ISUpdated", downloadStatus.IsUpdated),
                            new XElement("LastVersion", downloadStatus.LastVersion),
                            new XElement("CurrentVersion", downloadStatus.CurrentVersion),
                            new XElement("ToolUpdatedDate", downloadStatus.ToolUpdatedDate),
                            new XElement("ISUnistall", downloadStatus.IsUninstall),
                            new XElement("UninstallDate", downloadStatus.UninstallDate)
                                            )
                                    );

                errorTrace.WriteLog("NetgearClientService.asmx.cs :: GetNGToolDownloadDetails() :: method was completed.");
                var xmlDocument = new XmlDocument();
                xmlDocument.LoadXml(downloads.ToString());
                errorTrace = null;
                return xmlDocument;
            }
            catch (Exception ex)
            {
                XElement downloads = new XElement("Downloads",
                        new XElement("Download",
                            new XElement("ERROR", ex.Message)
                                            )
                                    );
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetNGToolDownloadDetails()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
                var xmlDocument = new XmlDocument();
                xmlDocument.LoadXml(downloads.ToString());
                return xmlDocument;
            }
        }

        #endregion

        #region "NG Message Center"
        /// <summary>
        /// Get the Message details
        /// </summary>
        /// <returns></returns>
        [WebMethod]
        public List<PublishedMessage> GetmessageDetails()
        {
            List<PublishedMessage> lst_msg_det = new List<PublishedMessage>();
            NGStatusEntities msgcenterDetails = new NGStatusEntities();
            try
            {
                DateTime now = DateTime.Now;
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteLog("================================================================================");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: GetmessageDetails() method was invoked.");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: GetmessageDetails() :: Initializing Message Center Entity Framework.");

                var get_msgdetails = (from Cat_master in msgcenterDetails.CategoryMaster
                                      join Msg_det in msgcenterDetails.MessageDetails on Cat_master.CategoryID equals Msg_det.CategoryID
                                      where ((Msg_det.PublishedOn <= now && Msg_det.Status == true &&
                                            !msgcenterDetails.CutomerMessageDetails.Any(cm => (cm.MessageID == Msg_det.MessageID))))
                                      orderby Msg_det.MessageID descending
                                      select new
                                      {
                                          MessageID = Msg_det.MessageID,
                                          MessageTitle = Msg_det.MessageTitle,
                                          CategoryName = Cat_master.CategoryName,
                                          ShortDescription = Msg_det.ShortDescription,
                                          CategoryID = Msg_det.CategoryID,
                                          Publishedon = Msg_det.PublishedOn,
                                          Isimportant = Msg_det.isImportant
                                      }).Take(6).ToList();

                if (get_msgdetails.Count < 6)
                    get_msgdetails = (from Cat_master in msgcenterDetails.CategoryMaster
                                      join Msg_det in msgcenterDetails.MessageDetails on Cat_master.CategoryID equals Msg_det.CategoryID
                                      where Msg_det.PublishedOn <= now && Msg_det.Status == true
                                      orderby Msg_det.MessageID descending
                                      select new
                                      {
                                          MessageID = Msg_det.MessageID,
                                          MessageTitle = Msg_det.MessageTitle,
                                          CategoryName = Cat_master.CategoryName,
                                          ShortDescription = Msg_det.ShortDescription,
                                          CategoryID = Msg_det.CategoryID,
                                          Publishedon = Msg_det.PublishedOn,
                                          Isimportant = Msg_det.isImportant
                                      }).Take(6).ToList();

                if (get_msgdetails != null)
                {
                    PublishedMessage obj_msg_det;

                    foreach (var obj_Msg_Det in get_msgdetails)
                    {

                        obj_msg_det = new PublishedMessage();
                        obj_msg_det.MessageID = obj_Msg_Det.MessageID;
                        if (obj_Msg_Det.MessageTitle.Length > 20)
                        {
                            obj_msg_det.MessageTitle = obj_Msg_Det.MessageTitle.Substring(0, 20) + "..";
                        }
                        else
                        {
                            obj_msg_det.MessageTitle = obj_Msg_Det.MessageTitle;
                        }
                        obj_msg_det.CategoryName = obj_Msg_Det.CategoryName;
                        if (obj_Msg_Det.ShortDescription.Length > 200)
                        {
                            obj_msg_det.ShortDescription = obj_Msg_Det.ShortDescription.Substring(0, 200) + "..";
                        }
                        else
                        {
                            obj_msg_det.ShortDescription = obj_Msg_Det.ShortDescription;
                        }
                        obj_msg_det.Isimportant = obj_Msg_Det.Isimportant;
                        obj_msg_det.Publishedon = obj_Msg_Det.Publishedon;

                        lst_msg_det.Add(obj_msg_det);

                    }
                }

            }

            catch (Exception ex)
            {

                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetmessageDetails()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;

            }

            return lst_msg_det;



        }

        /// <summary>
        /// Get the Message details
        /// </summary>
        /// <returns></returns>
        [WebMethod]
        public List<PublishedMessage> GetMobileMessageDetails(int customerID)
        {

            List<PublishedMessage> lst_msg_det = new List<PublishedMessage>();
            NGStatusEntities msgcenterDetails = new NGStatusEntities();
            try
            {
                DateTime now = DateTime.Now;
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteLog("================================================================================");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: GetmessageDetails() method was invoked.");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: GetmessageDetails() :: Initializing Message Center Entity Framework.");

                var get_msgdetails = (from Cat_master in msgcenterDetails.CategoryMaster
                                      join Msg_det in msgcenterDetails.MessageDetails on Cat_master.CategoryID equals Msg_det.CategoryID
                                      where ((Msg_det.PublishedOn <= now && Msg_det.Status == true &&
                                            !msgcenterDetails.CutomerMessageDetails.Any(cm => (cm.MessageID == Msg_det.MessageID))) && (Msg_det.customerId == null || Msg_det.customerId == customerID))
                                      orderby Msg_det.MessageID descending
                                      select new
                                      {
                                          MessageID = Msg_det.MessageID,
                                          MessageTitle = Msg_det.MessageTitle,
                                          CategoryName = Cat_master.CategoryName,
                                          ShortDescription = Msg_det.ShortDescription,
                                          CategoryID = Msg_det.CategoryID,
                                          Publishedon = Msg_det.PublishedOn,
                                          Isimportant = Msg_det.isImportant
                                      }).Take(6).ToList();

                if (get_msgdetails.Count < 6)
                    get_msgdetails = (from Cat_master in msgcenterDetails.CategoryMaster
                                      join Msg_det in msgcenterDetails.MessageDetails on Cat_master.CategoryID equals Msg_det.CategoryID
                                      where Msg_det.PublishedOn <= now && Msg_det.Status == true && (Msg_det.customerId == null || Msg_det.customerId == customerID)
                                      orderby Msg_det.MessageID descending
                                      select new
                                      {
                                          MessageID = Msg_det.MessageID,
                                          MessageTitle = Msg_det.MessageTitle,
                                          CategoryName = Cat_master.CategoryName,
                                          ShortDescription = Msg_det.ShortDescription,
                                          CategoryID = Msg_det.CategoryID,
                                          Publishedon = Msg_det.PublishedOn,
                                          Isimportant = Msg_det.isImportant
                                      }).Take(6).ToList();

                if (get_msgdetails != null)
                {
                    PublishedMessage obj_msg_det;

                    foreach (var obj_Msg_Det in get_msgdetails)
                    {

                        obj_msg_det = new PublishedMessage();
                        obj_msg_det.MessageID = obj_Msg_Det.MessageID;
                        if (obj_Msg_Det.MessageTitle.Length > 20)
                        {
                            obj_msg_det.MessageTitle = obj_Msg_Det.MessageTitle.Substring(0, 20) + "..";
                        }
                        else
                        {
                            obj_msg_det.MessageTitle = obj_Msg_Det.MessageTitle;
                        }
                        obj_msg_det.CategoryName = obj_Msg_Det.CategoryName;
                        if (obj_Msg_Det.ShortDescription.Length > 200)
                        {
                            obj_msg_det.ShortDescription = obj_Msg_Det.ShortDescription.Substring(0, 200) + "..";
                        }
                        else
                        {
                            obj_msg_det.ShortDescription = obj_Msg_Det.ShortDescription;
                        }
                        obj_msg_det.Isimportant = obj_Msg_Det.Isimportant;
                        obj_msg_det.Publishedon = obj_Msg_Det.Publishedon;

                        lst_msg_det.Add(obj_msg_det);

                    }
                }

            }

            catch (Exception ex)
            {

                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetmessageDetails()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;

            }

            return lst_msg_det;



        }

        /// <summary>
        /// To get the unread message count for the given customer
        /// </summary>
        /// <param name="CustomerID">Customer ID</param>
        /// <returns></returns>
        [WebMethod]
        public int GetUnreadMessageCount(string customerID)
        {
            int unreadMessageCount = 0;

            try
            {
                NGStatusEntities msgcenterDetails = new NGStatusEntities();
                DateTime now = DateTime.Now;
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteLog("================================================================================");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: GetmessageDetails() method was invoked.");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: GetmessageDetails() :: Initializing Message Center Entity Framework.");

                var get_msgdetails = (from Cat_master in msgcenterDetails.CategoryMaster
                                      join Msg_det in msgcenterDetails.MessageDetails on Cat_master.CategoryID equals Msg_det.CategoryID
                                      where Msg_det.PublishedOn <= now && Msg_det.Status == true &&
                                            !msgcenterDetails.CutomerMessageDetails.Any(cm => (cm.MessageID == Msg_det.MessageID))
                                      orderby Msg_det.MessageID descending
                                      select new
                                      {
                                          MessageID = Msg_det.MessageID,
                                          MessageTitle = Msg_det.MessageTitle,
                                          CategoryName = Cat_master.CategoryName,
                                          ShortDescription = Msg_det.ShortDescription,
                                          CategoryID = Msg_det.CategoryID,
                                          Publishedon = Msg_det.PublishedOn,
                                          Isimportant = Msg_det.isImportant
                                      }).Take(6).ToList();

                if (get_msgdetails.Count < 6)
                    get_msgdetails = (from Cat_master in msgcenterDetails.CategoryMaster
                                      join Msg_det in msgcenterDetails.MessageDetails on Cat_master.CategoryID equals Msg_det.CategoryID
                                      where Msg_det.PublishedOn <= now && Msg_det.Status == true
                                      orderby Msg_det.MessageID descending
                                      select new
                                      {
                                          MessageID = Msg_det.MessageID,
                                          MessageTitle = Msg_det.MessageTitle,
                                          CategoryName = Cat_master.CategoryName,
                                          ShortDescription = Msg_det.ShortDescription,
                                          CategoryID = Msg_det.CategoryID,
                                          Publishedon = Msg_det.PublishedOn,
                                          Isimportant = Msg_det.isImportant
                                      }).Take(6).ToList();

                int messageReadCount = (from msgdetails in get_msgdetails
                                        join custmsgdetails in msgcenterDetails.CutomerMessageDetails on msgdetails.MessageID equals custmsgdetails.MessageID
                                        where custmsgdetails.CustomerID == customerID
                                        select msgdetails).Count();


                //int messageReadCount1 = (from msgdetails in get_msgdetails
                //                        join custmsgdetails in msgcenterDetails.CutomerMessageDetails on msgdetails.MessageID equals custmsgdetails.MessageID
                //                        where custmsgdetails.CustomerID != customerID
                //                        select msgdetails).Count();

                unreadMessageCount = get_msgdetails.Count() - messageReadCount;
                msgcenterDetails.Dispose();
                msgcenterDetails = null;
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetmessageDetails()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
            }

            return unreadMessageCount;
        }

        [WebMethod]
        /// <summary>
        /// GetallmessageDetails
        /// </summary>
        /// <returns></returns>
        public List<PublishedMessage> GetallmessageDetails()
        {
            List<PublishedMessage> lst_msg_det = new List<PublishedMessage>();
            try
            {

                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteLog("================================================================================");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: GetallmessageDetails() method was invoked.");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: GetallmessageDetails() :: Initializing Message Center Entity Framework.");
                NGStatusEntities msgcenterDetails = new NGStatusEntities();
                var get_msgdetails = (from Cat_master in msgcenterDetails.CategoryMaster
                                      join Msg_det in msgcenterDetails.MessageDetails on Cat_master.CategoryID equals Msg_det.CategoryID
                                      select new { MessageID = Msg_det.MessageID, MessageTitle = Msg_det.MessageTitle, CategoryName = Cat_master.CategoryName, ShortDescription = Msg_det.ShortDescription, PublshedOn = Msg_det.PublishedOn });

                if (get_msgdetails != null)
                {
                    PublishedMessage obj_msg_det;

                    foreach (var obj_Msg_Det in get_msgdetails)
                    {
                        obj_msg_det = new PublishedMessage();
                        obj_msg_det.MessageID = obj_Msg_Det.MessageID;
                        obj_msg_det.MessageTitle = obj_Msg_Det.MessageTitle;
                        obj_msg_det.CategoryName = obj_Msg_Det.CategoryName;
                        obj_msg_det.ShortDescription = obj_Msg_Det.ShortDescription;
                        obj_msg_det.Publishedon = obj_Msg_Det.PublshedOn;
                        lst_msg_det.Add(obj_msg_det);
                    }
                }


            }

            catch (Exception ex)
            {

                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetallmessageDetails()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;

            }

            return lst_msg_det;


        }

        /// <summary>
        /// GetmessageviewDetails
        /// Input Param=msgID
        /// </summary>
        /// <returns></returns>
        [WebMethod]
        public List<PublishedMessage> GetmessageviewDetails(int msgID)
        {
            List<PublishedMessage> lst_msg_det = new List<PublishedMessage>();
            NGStatusEntities msgcenterDetails = new NGStatusEntities();
            try
            {

                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteLog("================================================================================");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: GetmessageviewDetails() method was invoked.");
                errorTrace.WriteLog("NetgearClientService.asmx.cs :: GetmessageviewDetails() :: Initializing Message Center Entity Framework.");

                var get_msgdetails = (from Cat_master in msgcenterDetails.CategoryMaster
                                      join Msg_det in msgcenterDetails.MessageDetails on Cat_master.CategoryID equals Msg_det.CategoryID
                                      where Msg_det.MessageID == msgID
                                      select new { MessageID = Msg_det.MessageID, MessageTitle = Msg_det.MessageTitle, CategoryName = Cat_master.CategoryName, ShortDescription = Msg_det.ShortDescription, Isimportant = Msg_det.isImportant, ReferenceURL = Msg_det.ReferenceURLs, Publishedon = Msg_det.PublishedOn, description = Msg_det.Description });

                if (get_msgdetails != null)
                {
                    PublishedMessage obj_msg_det;
                    foreach (var obj_Msg_Det in get_msgdetails)
                    {
                        obj_msg_det = new PublishedMessage();
                        obj_msg_det.MessageID = obj_Msg_Det.MessageID;
                        obj_msg_det.MessageTitle = obj_Msg_Det.MessageTitle;
                        obj_msg_det.Isimportant = obj_Msg_Det.Isimportant;
                        obj_msg_det.CategoryName = obj_Msg_Det.CategoryName;
                        obj_msg_det.ShortDescription = obj_Msg_Det.ShortDescription;
                        obj_msg_det.Publishedon = obj_Msg_Det.Publishedon;
                        obj_msg_det.referenceURL = obj_Msg_Det.ReferenceURL;
                        obj_msg_det.description = obj_Msg_Det.description;
                        obj_msg_det.Isimportant = obj_Msg_Det.Isimportant;
                        lst_msg_det.Add(obj_msg_det);
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetmessageviewDetails()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
            }
            return lst_msg_det;
        }


        [WebMethod]
        public string SaveReadMessageDetails(string CustomerID, int msgID)
        {
            try
            {
                using (NGStatusEntities nGStatusEntities = new NGStatusEntities())
                {
                    CutomerMessageDetails cutomerMessageDetails = new CutomerMessageDetails();
                    cutomerMessageDetails.CustomerID = CustomerID;
                    cutomerMessageDetails.MessageID = msgID;
                    cutomerMessageDetails.ReadDateTime = DateTime.Now;
                    nGStatusEntities.CutomerMessageDetails.AddObject(cutomerMessageDetails);
                    nGStatusEntities.SaveChanges();

                    return "1";
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetmessageviewDetails()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
                return "0";
            }
        }

        /// <summary>
        /// Functionality used to save Feedback details
        /// </summary>
        /// <param name="customerID"></param>
        /// <param name="feedbackMessage"></param>
        /// <param name="rating"></param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public bool SaveFeedBackDetails(int customerID, string feedbackMessage, double rating)
        {
            try
            {
                using (NGStatusEntities nGStatusEntities = new NGStatusEntities())
                {
                    FeedBackHistory feedBackDetails = new FeedBackHistory();

                    feedBackDetails.CustomrId = customerID;
                    feedBackDetails.Message = feedbackMessage;
                    feedBackDetails.Rating = (decimal)(rating);
                    feedBackDetails.CreatedOn = DateTime.Now;
                    feedBackDetails.CreatedBy = customerID;
                    nGStatusEntities.FeedBackHistory.AddObject(feedBackDetails);
                    nGStatusEntities.SaveChanges();

                    return true;
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "SaveFeedBackDetails()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
                return false;
            }
        }

        /// <summary>
        /// Functionality used to retrive the feedback based on the customerID
        /// </summary>
        /// <param name="customerID"></param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public MessageFeedBackDetails GetFeedBackDetails(int customerID)
        {
            try
            {
                MessageFeedBackDetails result = new MessageFeedBackDetails();
                using (NGStatusEntities nGStatusEntities = new NGStatusEntities())
                {

                    result = (from m in nGStatusEntities.FeedBackHistory
                              where m.CustomrId == customerID
                              orderby m.FeedBackId descending
                              select new MessageFeedBackDetails
                              {
                                  CustomrId = (int)m.CustomrId,
                                  Message = m.Message,
                                  Rating = (decimal)m.Rating
                              }).FirstOrDefault();

                    return result;

                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetFeedBackDetails()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
                return null;
            }

        }

        #endregion


        /// <summary>
        /// Functionality to retrive all feedback details
        /// </summary>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<MessageFeedBackDetails> GetAllFeedBackDetails()
        {
            try
            {
                List<MessageFeedBackDetails> lstFeedbackDetails = new List<MessageFeedBackDetails>();
                List<MessageFeedBackDetails> lstFeedbackDetails1 = new List<MessageFeedBackDetails>();
                using (NGStatusEntities nGStatusEntities = new NGStatusEntities())
                {

                    lstFeedbackDetails = nGStatusEntities.FeedBackHistory.AsEnumerable().OrderByDescending(m => m.FeedBackId)
                       .Select(m => new MessageFeedBackDetails
                    {
                        CustomrId = (int)m.CustomrId,
                        Message = HttpUtility.UrlDecode(m.Message),
                        Rating = (decimal)m.Rating
                    }).ToList<MessageFeedBackDetails>();

                    //lstFeedbackDetails = (from m in nGStatusEntities.FeedBackHistory
                    //                      let decStr = WebUtility.HtmlDecode(m.Message)
                    //                      orderby m.FeedBackId descending
                    //                      select new MessageFeedBackDetails
                    //                      {
                    //                          CustomrId = (int)m.CustomrId,
                    //                          Message = decStr,
                    //                          Rating = (decimal)m.Rating
                    //                      }).ToList<MessageFeedBackDetails>();

                    return lstFeedbackDetails;

                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetFeedBackDetails()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
                return null;
            }

        }

        /// <summary>
        /// Functionality used to save Network Map Details
        /// </summary>
        /// <param name="ipAddress"></param>
        /// <param name="networkMapDetails"></param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public bool SaveNetWorkMapDetails(string ipAddress, string networkMapDetails)
        {
            try
            {
                using (NGStatusEntities nGStatusEntities = new NGStatusEntities())
                {

                    var isExists = nGStatusEntities.NetworkMapDetails.Any(x => x.IPAddress == ipAddress);
                    if (isExists)
                    {
                        NetworkMapDetails objNetworkDet = new NetworkMapDetails();
                        objNetworkDet = nGStatusEntities.NetworkMapDetails.Where(x => x.IPAddress == ipAddress).SingleOrDefault<NetworkMapDetails>();
                        objNetworkDet.DeviceDetails = networkMapDetails;
                    }
                    else
                    {
                        nGStatusEntities.NetworkMapDetails.AddObject(new NetworkMapDetails()
                        {
                            IPAddress = ipAddress,
                            DeviceDetails = networkMapDetails
                        });
                    }

                    nGStatusEntities.SaveChanges();

                    return true;
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "SaveNetWorkMapDetails()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
                return false;
            }
        }

        /// <summary>
        /// Functionality used to retrive the NetworkMap device details based on the IPAddres
        /// </summary>
        /// <param name="ipAddress"></param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public NetWorkDeviceDetails GetNetworkMapDeviceDetails(string ipAddress)
        {
            try
            {
                NetWorkDeviceDetails result = new NetWorkDeviceDetails();
                using (NGStatusEntities nGStatusEntities = new NGStatusEntities())
                {

                    result = (from m in nGStatusEntities.NetworkMapDetails
                              where m.IPAddress == ipAddress
                              select new NetWorkDeviceDetails
                              {
                                  IPAddress = m.IPAddress,
                                  DeviceDetails = m.DeviceDetails
                              }).FirstOrDefault();

                    return result;

                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetNetworkMapDeviceDetails()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
                return null;
            }

        }

        #region Parental Control
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<Parental> RetriveALLParental(int customerID)
        {
            List<Parental> allparental = new List<Parental>();
            try
            {
                using (NGStatusEntities srp_context = new NGStatusEntities())
                {
                    IQueryable<Parental> allparental_obj = (from bind in srp_context.ParentalControl
                                                            //join cus in srp_context.Customer
                                                            //on bind.Customer_ID equals cus.Customer_ID
                                                            where bind.Customer_ID == customerID
                                                            select new Parental
                                                            {
                                                                Slno = bind.Slno,
                                                                Customer_ID = (int)bind.Customer_ID,
                                                                Blocked = bind.Blocked,
                                                                Type = bind.Type,
                                                                BlockedOn = (DateTime)bind.BlockedOn
                                                            });
                    allparental = allparental_obj.ToList<Parental>();
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "RetriveALLParental()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
            }

            return allparental;
        }

        /// <summary>
        /// Functionality to retrive all timezone details
        /// </summary>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<TimeZoneDetails> GetAllTimeZones()
        {
            List<TimeZoneDetails> lstTimeZoneDetails = new List<TimeZoneDetails>();
            try
            {
                using (NGStatusEntities srp_context = new NGStatusEntities())
                {
                    lstTimeZoneDetails = (from timeDet in srp_context.TimeZoneDetails
                                          select new TimeZoneDetails
                                          {
                                              TimeZoneID = timeDet.TimeZoneID,
                                              TimeZone = timeDet.TimeZone,
                                              Time = timeDet.Time,
                                              Country = timeDet.Country
                                          }).ToList<TimeZoneDetails>();
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetAllTimeZones()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
            }

            return lstTimeZoneDetails;
        }

        #region "Phone Finder"

        /// <summary>
        /// Functionality used to track the device latitude and logitude
        /// </summary>
        /// <param name="latitude"></param>
        /// <param name="longitude"></param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public bool TrackDeviceLocation(int customerID, string latitude, string longitude)
        {
            try
            {
                DeviceLocation deviceLocation = new DeviceLocation();
                using (NGStatusEntities nGStatusEntities = new NGStatusEntities())
                {
                    deviceLocation = nGStatusEntities.DeviceLocation.Where(x => x.CustomerID == customerID).OrderByDescending(track => track.TrackingFromTime).FirstOrDefault();
                    //&& x.Latitude == latitude && x.Longitude == longitude
                    if (deviceLocation != null)
                    {

                        if (deviceLocation.Latitude != latitude || deviceLocation.Longitude != longitude)
                        {
                            deviceLocation.TrackingToTime = DateTime.Now;
                            nGStatusEntities.SaveChanges();
                            InsertDeviceDetails(customerID, latitude, longitude, nGStatusEntities);
                        }
                        else
                        {
                            deviceLocation.TrackingToTime = DateTime.Now;
                            nGStatusEntities.SaveChanges();
                        }

                    }
                    else
                    {
                        InsertDeviceDetails(customerID, latitude, longitude, nGStatusEntities);
                    }
                    nGStatusEntities.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "TrackDeviceLocation()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
                return false;
            }
        }

        private static void InsertDeviceDetails(int customerID, string latitude, string longitude, NGStatusEntities nGStatusEntities)
        {
            try
            {
                nGStatusEntities.DeviceLocation.AddObject(new DeviceLocation()
                    {
                        CustomerID = customerID,
                        Latitude = latitude,
                        Longitude = longitude,
                        TrackingFromTime = DateTime.Now,
                        TrackingToTime = DateTime.Now

                    });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Function return the current tracking location of the device
        /// </summary>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public DeviceLocationDetails GetCurrentDeviceLocation(int customerID)
        {
            DeviceLocation devDet = new DeviceLocation();
            DeviceLocationDetails deviceLocation = new DeviceLocationDetails();
            try
            {

                using (NGStatusEntities srp_context = new NGStatusEntities())
                {
                    //deviceLocation = (from dev in srp_context.DeviceLocation
                    //        where dev.CustomerID == customerID
                    //        orderby dev.TrackingToTime descending
                    //        let fromTime = dev.TrackingFromTime.ToString("dd/MM/yyyy")
                    //        let toTime = dev.TrackingToTime.ToString("dd/MM/yyyy")
                    //        select new  DeviceLocationDetails()
                    //        {
                    //            DeviceLatitude = dev.Latitude,
                    //            DeviceLongitude = dev.Longitude,
                    //            TrackFromTime = fromTime,
                    //            TrackToime = toTime
                    //        }).FirstOrDefault();

                    //    .Select(x => new DeviceLocationDetails()
                    //{
                    //    DeviceLatitude = x.Latitude,
                    //    DeviceLongitude = x.Longitude,
                    //    TrackFromTime = SqlFunctions.StringConvert((double)x.TrackingFromTime.Month).TrimStart() + "/" +
                    //                        SqlFunctions.DateName("day", x.TrackingFromTime).Trim() + "/" +
                    //                        SqlFunctions.DateName("year", x.TrackingFromTime) + " " +
                    //                         SqlFunctions.DateName("hour", x.TrackingFromTime) + ":" +
                    //                          SqlFunctions.DateName("minute", x.TrackingFromTime) + " " +
                    //                         SqlFunctions.DateName("TZoffset ", x.TrackingFromTime),
                    //    TrackToime = string.Empty
                    //})


                    devDet = srp_context.DeviceLocation.Where(x => x.CustomerID == customerID).OrderByDescending(track => track.TrackingToTime)
                    .FirstOrDefault();
                    deviceLocation.DeviceLatitude = devDet.Latitude;
                    deviceLocation.DeviceLongitude = devDet.Longitude;
                    deviceLocation.TrackFromTime = devDet.TrackingFromTime.ToString("dd/MM/yyyy hh:mm tt");
                    deviceLocation.TrackToime = devDet.TrackingToTime.ToString("dd/MM/yyyy hh:mm tt");
                    deviceLocation.TimeDiff = (devDet.TrackingToTime.Subtract(devDet.TrackingFromTime).Hours > 24 ? devDet.TrackingToTime.Subtract(devDet.TrackingFromTime).Days.ToString() + " Days" : devDet.TrackingToTime.Subtract(devDet.TrackingFromTime).Hours.ToString() + " Hours");

                    //var devdet = srp_context.DeviceLocation.Where(x => x.CustomerID == customerID).OrderByDescending(track => track.TrackingToTime).FirstOrDefault();



                }




            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetCurrentDeviceLocation()", "", ex.Message, ex.StackTrace, "Error");
                deviceLocation = null;
                errorTrace = null;
            }

            return deviceLocation;
        }

        /// <summary>
        /// Functionality used to track the device location details
        /// </summary>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<DeviceLocationDetails> GetDeviceTrackingDetails(int customerID)
        {
            List<DeviceLocation> lstDevLoc = new List<DeviceLocation>();
            List<DeviceLocationDetails> lstDeviceLocation = new List<DeviceLocationDetails>();
            try
            {
                using (NGStatusEntities srp_context = new NGStatusEntities())
                {
                    lstDevLoc = srp_context.DeviceLocation.Where(x => x.CustomerID == customerID).OrderByDescending(track => track.TrackingToTime).ToList();
                    //.Select(
                    //    x => new DeviceLocationDetails()
                    //    {
                    //        DeviceLatitude = x.Latitude,
                    //        DeviceLongitude = x.Longitude,
                    //        TrackFromTime = x.TrackingFromTime.ToLongDateString(),
                    //        TrackToime = x.TrackingToTime.ToLongDateString()
                    //    }).ToList<DeviceLocationDetails>();

                    if (lstDevLoc != null)
                    {
                        foreach (var item in lstDevLoc)
                        {
                            DeviceLocationDetails objDevDet = new DeviceLocationDetails();
                            objDevDet.DeviceLatitude = item.Latitude;
                            objDevDet.DeviceLongitude = item.Longitude;
                            objDevDet.TrackFromTime = item.TrackingFromTime.ToString("dd/MM/yyyy hh:mm tt");
                            objDevDet.TrackToime = item.TrackingToTime.ToString("dd/MM/yyyy hh:mm tt");
                            objDevDet.TimeDiff = (item.TrackingToTime.Subtract(item.TrackingFromTime).Hours > 24 ? item.TrackingToTime.Subtract(item.TrackingFromTime).Days.ToString() + " Days" : item.TrackingToTime.Subtract(item.TrackingFromTime).Hours.ToString() + " Hours");
                            lstDeviceLocation.Add(objDevDet);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetDeviceTrackingDetails()", "", ex.Message, ex.StackTrace, "Error");
                lstDeviceLocation = null;
                errorTrace = null;
            }
            return lstDeviceLocation;
        }

        /// <summary>
        /// Functionality used to insert the phone settings
        /// </summary>
        /// <param name="customerID"></param>
        /// <param name="isPhoneFind"></param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public bool InsertPhoneSettings(int customerID, bool isPhoneFind)
        {
            PhoneSettings objPhoneSettings = new PhoneSettings();
            try
            {
                using (NGStatusEntities nGStatusEntities = new NGStatusEntities())
                {
                    objPhoneSettings = nGStatusEntities.PhoneSettings.Where(x => x.CustomerID == customerID).FirstOrDefault();
                    if (objPhoneSettings != null)
                    {
                        objPhoneSettings.IsPhoneTrack = isPhoneFind;
                    }
                    else
                    {
                        nGStatusEntities.PhoneSettings.AddObject(new PhoneSettings()
                        {
                            CustomerID = customerID,
                            IsPhoneTrack = isPhoneFind
                        });
                    }
                    nGStatusEntities.SaveChanges();
                    return true;
                }

            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "InsertPhoneSettings()", "", ex.Message, ex.StackTrace, "Error");
                objPhoneSettings = null;
                errorTrace = null;
                return false;
            }
        }

        /// <summary>
        /// functionality used tio get device settings
        /// </summary>
        /// <param name="customerID"></param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public bool GetDeviceSettingDetails(int customerID)
        {
            PhoneSettings objDeviceSettings = new PhoneSettings();
            bool isPhoneTracking = false;
            try
            {
                using (NGStatusEntities srp_context = new NGStatusEntities())
                {
                    objDeviceSettings = srp_context.PhoneSettings.Where(x => x.CustomerID == customerID).FirstOrDefault();
                    if (objDeviceSettings != null)
                    {
                        isPhoneTracking = objDeviceSettings.IsPhoneTrack;
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetDeviceTrackingDetails()", "", ex.Message, ex.StackTrace, "Error");
                objDeviceSettings = null;
                errorTrace = null;
                return false;
            }
            return isPhoneTracking;
        }



        #endregion

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public bool AddParental(Parental parentalDetails)
        {
            bool add_parental = false;
            try
            {

                using (NGStatusEntities srp_context = new NGStatusEntities())
                {
                    ParentalControl Parental_obj = new ParentalControl();
                    Parental_obj.Customer_ID = parentalDetails.Customer_ID;
                    Parental_obj.Blocked = parentalDetails.Blocked;
                    Parental_obj.Type = parentalDetails.Type;
                    //Parental_obj.BlockedOn = parentalDetails.BlockedOn;
                    Parental_obj.BlockedOn = DateTime.Now;
                    srp_context.ParentalControl.AddObject(Parental_obj);
                    srp_context.SaveChanges();
                    add_parental = true;
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "AddParental()", "", ex.Message, ex.StackTrace, "Error");
                add_parental = false;
            }
            return add_parental;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public bool RemoveParental(int slno)
        {
            bool delete_note = false;
            try
            {
                using (NGStatusEntities srp_context = new NGStatusEntities())
                {
                    var obj = (from deletebind in srp_context.ParentalControl
                               where deletebind.Slno == slno
                               select deletebind).Single();
                    srp_context.DeleteObject(obj);
                    srp_context.SaveChanges();
                    delete_note = true;

                }

            }

            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "RemoveParental()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
                return false;
            }

            return delete_note;
        }

        #endregion

        #region "NG KnowledgeBase"
        /// <summary>
        /// To Initialize the Knowledge Base Service
        /// </summary>
        /// <param name="client">RightNowKnowledgePortClient object to start interaction with service</param>
        /// <param name="header">ClientInfoHeader object to store the Header information</param>
        /// <param name="knowledgeInteractionId">InteractionID for every API call</param>
        private void GetKnowledgeBaseHeaders(ref RightNowKnowledgePortClient client, ref ClientInfoHeader header, ref string knowledgeInteractionId)
        {
            client = new RightNowKnowledgePortClient();
            client.ClientCredentials.UserName.UserName = ConfigurationManager.AppSettings["KB_UserName"];
            client.ClientCredentials.UserName.Password = ConfigurationManager.AppSettings["KB_Password"];

            header = new ClientInfoHeader();
            header.AppID = ConfigurationManager.AppSettings["KB_AppID"];

            ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(
            delegate
            {
                return true;
            });

            knowledgeInteractionId = client.StartInteraction(header, header.AppID, ConfigurationManager.AppSettings["KB_UserIPAddress"], null, ConfigurationManager.AppSettings["KB_UserAgent"]);
        }

        /// <summary>
        /// Search the KnowledgeBase for given search term
        /// </summary>
        /// <param name="searchTerm">search string</param>
        /// <param name="startIndex">start index of the record</param>
        /// <param name="limit">No.of records to be retrieved</param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<KBSearchResponse> SearchContent(string searchTerm, int startIndex, int limit)
        {
            List<KBSearchResponse> kbSearchResponseList = null;

            try
            {
                RightNowKnowledgePortClient client = null;
                ClientInfoHeader header = null;
                String knowledgeInteractionId = null;

                GetKnowledgeBaseHeaders(ref client, ref header, ref knowledgeInteractionId);

                SearchResponse searchResponse = client.SearchContent(header, knowledgeInteractionId, searchTerm, null, true, true, limit, null, null, null, startIndex);

                if (searchResponse != null && searchResponse.SummaryContents != null)
                {
                    kbSearchResponseList = new List<KBSearchResponse>();
                    foreach (SummaryContent summaryContent in searchResponse.SummaryContents)
                    {
                        KBSearchResponse kbSearchResponse = new KBSearchResponse();
                        kbSearchResponse.TotalResults = searchResponse.TotalResults;
                        kbSearchResponse.ID = ((RNObject)(summaryContent)).ID.id;
                        kbSearchResponse.Title = summaryContent.Title;
                        kbSearchResponse.Excerpt = summaryContent.Excerpt;
                        kbSearchResponse.Url = summaryContent.URL;
                        kbSearchResponse.ContentOriginID = ((AnswerSummaryContent)(summaryContent)).ContentOrigin.ID.id;
                        kbSearchResponse.ContentOriginName = ((AnswerSummaryContent)(summaryContent)).ContentOrigin.Name;
                        kbSearchResponseList.Add(kbSearchResponse);
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "SearchContent()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
            }

            return kbSearchResponseList;
        }

        /// <summary>
        /// get the popular content provided by the Knowledge base
        /// </summary>
        /// <param name="limit">No.of records to be retrieved</param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<KBSearchResponse> GetPopularContent(int limit)
        {
            List<KBSearchResponse> kbSearchResponseList = null;

            try
            {
                RightNowKnowledgePortClient client = null;
                ClientInfoHeader header = null;
                String knowledgeInteractionId = null;

                GetKnowledgeBaseHeaders(ref client, ref header, ref knowledgeInteractionId);

                //In the getting started app we do not apply any filters
                ContentSearch contentSearch = new ContentSearch();

                //We do not supply a sort options parameter, this will use the default 'Weight' as the sort field
                ContentListResponse contentListResponse = client.GetPopularContent(header, knowledgeInteractionId, contentSearch, limit, null);

                if (contentListResponse != null && contentListResponse.SummaryContents != null)
                {
                    kbSearchResponseList = new List<KBSearchResponse>();
                    foreach (SummaryContent summaryContent in contentListResponse.SummaryContents)
                    {
                        KBSearchResponse kbSearchResponse = new KBSearchResponse();
                        kbSearchResponse.ID = ((RNObject)(summaryContent)).ID.id;
                        kbSearchResponse.Title = summaryContent.Title;
                        kbSearchResponse.Excerpt = string.IsNullOrEmpty(summaryContent.Excerpt) || summaryContent.Excerpt.Equals("\n") ? "N/A" : summaryContent.Excerpt;
                        kbSearchResponse.Url = summaryContent.URL;
                        kbSearchResponse.ContentOriginID = ((AnswerSummaryContent)(summaryContent)).ContentOrigin.ID.id;
                        kbSearchResponse.ContentOriginName = ((AnswerSummaryContent)(summaryContent)).ContentOrigin.Name;
                        kbSearchResponseList.Add(kbSearchResponse);
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetPopularContent()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
            }

            return kbSearchResponseList;
        }

        /// <summary>
        /// To get the Recomended content of the selected product.
        /// </summary>
        /// <param name="limit">No.of records to be retrieved</param>
        /// <param name="productName">selected product name</param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<KBSearchResponse> GetKBRecommendedContent(int limit, string productName)
        {
            List<KBSearchResponse> kbSearchResponseList = null;

            try
            {
                RightNowKnowledgePortClient client = null;
                ClientInfoHeader header = null;
                String knowledgeInteractionId = null;

                GetKnowledgeBaseHeaders(ref client, ref header, ref knowledgeInteractionId);

                ////Filter the popular answers for those that are assigned to the "Replacement/Repair Coverage" product
                ContentSearch contentSearch = new ContentSearch();
                ServiceProductContentFilter productFilter = new ServiceProductContentFilter();
                NamedIDHierarchy prodHierarchy = new NamedIDHierarchy();
                prodHierarchy.Name = productName;
                productFilter.ServiceProduct = prodHierarchy;
                contentSearch.Filters = new ContentFilter[] { productFilter };

                ContentListResponse contentListResponse = client.GetSmartAssistantSearch(header, knowledgeInteractionId, productName, productName, contentSearch, limit);

                if (contentListResponse != null && contentListResponse.SummaryContents != null)
                {
                    kbSearchResponseList = new List<KBSearchResponse>();
                    foreach (SummaryContent summaryContent in contentListResponse.SummaryContents)
                    {
                        KBSearchResponse kbSearchResponse = new KBSearchResponse();
                        kbSearchResponse.ID = ((RNObject)(summaryContent)).ID.id;
                        kbSearchResponse.Title = summaryContent.Title;
                        kbSearchResponse.Excerpt = string.IsNullOrEmpty(summaryContent.Excerpt) || summaryContent.Excerpt.Equals("\n") ? "N/A" : summaryContent.Excerpt;
                        kbSearchResponse.Url = summaryContent.URL;
                        kbSearchResponse.ContentOriginID = ((AnswerSummaryContent)(summaryContent)).ContentOrigin.ID.id;
                        kbSearchResponse.ContentOriginName = ((AnswerSummaryContent)(summaryContent)).ContentOrigin.Name;
                        kbSearchResponseList.Add(kbSearchResponse);
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetRecommendedContent()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
            }

            return kbSearchResponseList;
        }
        /// <summary>
        /// Get Complete content for the particular record
        /// </summary>
        /// <param name="answerContentID">Records ID</param>
        /// <param name="viewOriginID">viewOrigin ID</param>
        /// <param name="viewOriginName">viewOrigin Name</param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public KBSearchResponse GetContent(long answerContentID, long viewOriginID, string viewOriginName)
        {
            KBSearchResponse kbSearchResponse = null;

            try
            {
                RightNowKnowledgePortClient client = null;
                ClientInfoHeader header = null;
                String knowledgeInteractionId = null;

                GetKnowledgeBaseHeaders(ref client, ref header, ref knowledgeInteractionId);

                AnswerContent contentTemplate = new AnswerContent();
                contentTemplate.ID = new ID() { id = answerContentID, idSpecified = true };

                ContentSecurityOptions securityOptions = new ContentSecurityOptions();

                ContentViewOrigin viewOrigin = new ContentViewOrigin();
                viewOrigin.ID = new ID() { id = viewOriginID, idSpecified = true };
                viewOrigin.Name = viewOriginName;

                AnswerContent answerContent = (AnswerContent)client.GetContent(header, knowledgeInteractionId, contentTemplate, securityOptions, viewOrigin);

                if (answerContent != null)
                {
                    kbSearchResponse = new KBSearchResponse();
                    long answerID = 0;
                    bool iSuccess = Int64.TryParse(answerContent.Name, out answerID);
                    kbSearchResponse.ID = answerContentID;
                    kbSearchResponse.Title = answerContent.Summary;
                    //To open the URL in new window
                    if (answerContent.Question != null)
                    {
                        kbSearchResponse.Excerpt = answerContent.Question.Replace("<a", "<a target=\"_blank\"").Replace("href=\"www", "href=\"http://www");
                    }
                    if (answerContent.Solution != null)
                    {
                        kbSearchResponse.Excerpt = kbSearchResponse.Excerpt + "<br/>" + answerContent.Solution.Replace("<a", "<a target=\"_blank\"").Replace("href=\"www", "href=\"http://www");
                    }
                    kbSearchResponse.Url = answerContent.URL;
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetContent()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
            }

            return kbSearchResponse;
        }
        #endregion


        #region "Pushnotificatoin"

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string CheckGHMobileUser(int customerID, string customerEmail, string registratoinID, int osType)
        {
            bool isUserRegistered = false;
            string pushDetails = string.Empty;
            try
            {
                GHMobileRegistrationDetails ghMobileUserDet = new GHMobileRegistrationDetails();
                using (NGStatusEntities nGStatusEntities = new NGStatusEntities())
                {
                    //isUserRegistered = nGStatusEntities.GHMobileRegistrationDetails.Any(x => x.CustomerID == customerID && x.RegistrationID == registratoinID);
                    ghMobileUserDet = nGStatusEntities.GHMobileRegistrationDetails.FirstOrDefault(x => x.CustomerID == customerID && x.osType == osType);
                    if (ghMobileUserDet == null)
                    {
                        nGStatusEntities.GHMobileRegistrationDetails.AddObject(new GHMobileRegistrationDetails()
                        {
                            CustomerID = customerID,
                            CustomerEmail = customerEmail,
                            RegistrationID = registratoinID,
                            osType = osType,
                            CreatedDate = DateTime.Now
                        });
                        if (osType == 1)
                        {
                            pushDetails = SendWelcomePushNotification(registratoinID);
                        }
                        else if (osType == 2)
                        {
                            SendIOSpushMessage(registratoinID);
                        }
                    }
                    else
                    {
                        ghMobileUserDet.RegistrationID = registratoinID;
                    }
                    nGStatusEntities.SaveChanges();
                }
                return pushDetails;
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetNetworkMapDeviceDetails()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
                return null;
            }

        }

        public string SendWelcomePushNotification(string regID)
        {
            String sResponseFromServer = string.Empty;
            try
            {
                string GoogleAppID = ConfigurationManager.AppSettings["GoogleAppId"];
                var SENDER_ID = ConfigurationManager.AppSettings["SenderID"];

                //string message = "some test message";
                string tickerText = ConfigurationManager.AppSettings["NotifyHeader"];
                string message = ConfigurationManager.AppSettings["WelcomeMessage"];
                string pushType = "Welcome";
                int mssgCount = 1;
                string postData =
                               "{ \"registration_ids\": [ \"" + regID + "\" ], " +
                                 "\"data\": {\"title\":\"" + tickerText + "\", " +
                                            "\"PushType\":\"" + pushType + "\", " +
                                            "\"message\": \"" + message + "\"}}";
                WebRequest tRequest;
                tRequest = WebRequest.Create("https://android.googleapis.com/gcm/send");
                tRequest.Method = "post";
                tRequest.ContentType = "application/json";
                tRequest.Headers.Add(string.Format("Authorization: key={0}", GoogleAppID));
                tRequest.Headers.Add(string.Format("Sender: id={0}", SENDER_ID));

                Byte[] byteArray = Encoding.UTF8.GetBytes(postData);
                tRequest.ContentLength = byteArray.Length;

                Stream dataStream = tRequest.GetRequestStream();
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();
                WebResponse tResponse = tRequest.GetResponse();
                dataStream = tResponse.GetResponseStream();

                StreamReader tReader = new StreamReader(dataStream);

                sResponseFromServer = tReader.ReadToEnd();

                tReader.Close();
                dataStream.Close();
                tResponse.Close();
            }
            catch (Exception ex)
            {
            }
            return sResponseFromServer;
        }

        public void SendIOSpushMessage(string deviceID)
        {
            int port = 2195;
            String hostname = "gateway.sandbox.push.apple.com";
            string message = ConfigurationManager.AppSettings["WelcomeMessage"];

            //String certificatePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "IOSCERT", "Certificates.p12");
            //String certificatePath = HttpContext.Current.Server.MapPath("/IOSCERT/Certificates.p12");
            String certificatePath = ConfigurationManager.AppSettings["PushCertFile"];
            ErrorTracker errorTrace = new ErrorTracker();
            errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "Path()", "", certificatePath, certificatePath, "Path");
            X509Certificate2 clientCertificate = new X509Certificate2(System.IO.File.ReadAllBytes(certificatePath), ConfigurationManager.AppSettings["PushCertPass"]);
            X509Certificate2Collection certificatesCollection = new X509Certificate2Collection(clientCertificate);

            TcpClient client = new TcpClient(hostname, port);
            SslStream sslStream = new SslStream(client.GetStream(), false, new RemoteCertificateValidationCallback(ValidateServerCertificate), null);

            try
            {
                //sslStream.AuthenticateAsClient(hostname, certificatesCollection, SslProtocols.Ssl3, false);

                sslStream.AuthenticateAsClient(hostname, certificatesCollection, System.Security.Authentication.SslProtocols.Tls, false);
                MemoryStream memoryStream = new MemoryStream();
                BinaryWriter writer = new BinaryWriter(memoryStream);
                writer.Write((byte)0);
                writer.Write((byte)0);
                writer.Write((byte)32);

                writer.Write(HexStringToByteArray(deviceID.ToUpper()));
                String payload = "{\"aps\":{\"alert\":\"" + message + "\",\"badge\":1,\"sound\":\"default\"}}";
                writer.Write((byte)0);
                writer.Write((byte)payload.Length);
                byte[] b1 = System.Text.Encoding.UTF8.GetBytes(payload);
                writer.Write(b1);
                writer.Flush();
                byte[] array = memoryStream.ToArray();
                sslStream.Write(array);
                sslStream.Flush();
                client.Close();

            }
            catch (System.Security.Authentication.AuthenticationException ex)
            {
                client.Close();
            }
            catch (Exception e)
            {
                client.Close();
            }
        }

        public static bool ValidateServerCertificate(object sender,
                                             X509Certificate certificate,
                                             X509Chain chain,
                                             SslPolicyErrors sslPolicyErrors)
        {
            if (sslPolicyErrors == SslPolicyErrors.None)
                return true;



            // Do not allow this client to communicate with unauthenticated servers.
            return false;
        }

        public static byte[] HexStringToByteArray(string hexString)
        {
            byte[] HexAsBytes = new byte[hexString.Length / 2];
            for (int index = 0; index < HexAsBytes.Length; index++)
            {
                string byteValue = hexString.Substring(index * 2, 2);
                HexAsBytes[index] = byte.Parse(byteValue, NumberStyles.HexNumber, CultureInfo.InvariantCulture);
            }
            return HexAsBytes;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string SendPushNotification(string deviceId, string message)
        {
            String sResponseFromServer = string.Empty;
            try
            {
                string GoogleAppID = ConfigurationManager.AppSettings["GoogleAppId"];
                var SENDER_ID = ConfigurationManager.AppSettings["SenderID"];

                //string message = "some test message";
                string tickerText = "GH Message";
                string postData =
                               "{ \"registration_ids\": [ \"" + deviceId + "\" ], " +
                                 "\"data\": {\"title\":\"" + tickerText + "\", " +
                                            "\"message\": \"" + message + "\"}}";
                WebRequest tRequest;
                tRequest = WebRequest.Create("https://android.googleapis.com/gcm/send");
                tRequest.Method = "post";
                tRequest.ContentType = "application/json";
                tRequest.Headers.Add(string.Format("Authorization: key={0}", GoogleAppID));
                tRequest.Headers.Add(string.Format("Sender: id={0}", SENDER_ID));

                Byte[] byteArray = Encoding.UTF8.GetBytes(postData);
                tRequest.ContentLength = byteArray.Length;

                Stream dataStream = tRequest.GetRequestStream();
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();

                WebResponse tResponse = tRequest.GetResponse();
                dataStream = tResponse.GetResponseStream();

                StreamReader tReader = new StreamReader(dataStream);

                sResponseFromServer = tReader.ReadToEnd();

                tReader.Close();
                dataStream.Close();
                tResponse.Close();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return sResponseFromServer;

        }

        #endregion

        #region "Community"

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<CommunitySerachDetails> SearchCommunityDetails(string searchKey)
        {
            List<CommunitySerachDetails> lstDetails = new List<CommunitySerachDetails>();
            try
            {
                string loginUrl = ConfigurationManager.AppSettings["CommunityLoginURL"];
                string msgUrl = ConfigurationManager.AppSettings["CommunityMessageURL"];
                string urlParameters = "?user.login=MobileAppUser&user.password=UBLsFBV@wZ";
                string searchVal = (searchKey != string.Empty) ? searchKey : "how";
                XmlDocument doc = new XmlDocument();
                var client = new RestClient();
                client.EndPoint = loginUrl;
                client.Method = HttpVerb.GET;
                client.PostData = urlParameters;
                var json = client.MakeRequest(urlParameters);
                doc.LoadXml(json);
                XmlNodeList xnList = doc.SelectNodes("/response[@*]");
                foreach (XmlNode xn in xnList)
                {
                    XmlNode responsevalue = xn.SelectSingleNode("value");
                    if (responsevalue != null)
                    {
                        var client1 = new RestClient();
                        client.EndPoint = msgUrl;
                        string urlParameters1 = "?q=" + searchVal + "&restapi.session_key=" + responsevalue.InnerText + "&restapi.response_style=view";// "&xslt=json.xsl";// &restapi.format_detail=full_list_element &restapi.response_style=view&page_size=5";
                        client.Method = HttpVerb.GET;
                        client.PostData = urlParameters1;
                        var json1 = client.MakeRequest(urlParameters1);
                        XmlDocument doc1 = new XmlDocument();
                        doc1.LoadXml(json1);
                        XmlNodeList xnList1 = doc1.SelectNodes("/response/messages/message");
                        foreach (XmlNode msg in xnList1)
                        {
                            CommunitySerachDetails comdetails = new CommunitySerachDetails();
                            comdetails.Link = msg.Attributes[2].Value;
                            comdetails.PostedTime = msg.SelectSingleNode("post_time").InnerText;
                            comdetails.Title = msg.SelectSingleNode("subject").InnerText;
                            lstDetails.Add(comdetails);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstDetails;
        }
        #endregion

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public KBArticles CatKB(string productName)
        {
            KBArticles kbDetails = new KBArticles();
            ProductKB kblist = null;
            try
            {
                kblist = GetProductKBList(productName);
                kbDetails.product = kblist.product;
                kbDetails.product_id = Convert.ToInt32(kblist.product_id);
                List<CategoryAnswers> lstProCat = new List<CategoryAnswers>();

                foreach (var cat in kblist.productCategories)
                {
                    List<ProductAnswers> lstanswers = new List<ProductAnswers>();
                    CategoryAnswers catSet = new CategoryAnswers();
                    catSet.category_name = cat.category_name;
                    catSet.category_id = cat.category_id;
                    catSet.category_description = cat.category_description;
                    foreach (var ans in kblist.answers)
                    {
                        if (ans.categories.Contains(cat.category_id.ToString()))
                        {
                            lstanswers.Add(new ProductAnswers()
                            {
                                id = ans.id.ToString(),
                                title = ans.title,
                                desc = ans.desc,
                                categories = cat.category_id.ToString()
                            });
                        }
                        catSet.cats_answers = lstanswers;
                    }
                    lstProCat.Add(catSet);
                }
                kbDetails.productCategories = lstProCat;
                return kbDetails;
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "CatKB()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
                return null;
            }
        }

        private static ProductKB GetProductKBList(string productName)
        {
            ProductKB kblist = null;
            string kbUrl = ConfigurationManager.AppSettings["NewKBArticle"];
            XmlDocument doc = new XmlDocument();
            var client = new RestClient();
            client.EndPoint = kbUrl + productName;
            client.Method = HttpVerb.GET;
            var json = client.MakeRequest("");
            //var res = json.Substring(1, (json.Length - 3));
            var res = json.Substring(json.StartsWith("(") ? 1 : 0, (json.LastIndexOf(")") - 1));
            kblist = Newtonsoft.Json.JsonConvert.DeserializeObject<ProductKB>(res);
            return kblist;
        }

        #region "Terms And Condition"

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public AppWithTermsAndConditions[] GetTermsAndConditions()
        {
            AppWithTermsAndConditions[] termsConditions = null;
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    termsConditions = getServiceClient.GetLatestTermsAndConditions(APIService.GetAPIString(), ConfigurationManager.AppSettings["AppName"]).AppInfo;
                }

            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "GetTermsAndConditions()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
                return null;
            }
            return termsConditions;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public TermsConditionsUpdateType UpdateCuustomerTermsCondition(int customerID, string termID)
        {
            var termsConditionsUpdate = new TermsConditionsUpdateType();
            try
            {
                using (var getServiceClient = new ServicesClient())
                {
                    termsConditionsUpdate = getServiceClient.TermsConditionsUpdate(APIService.GetAPIString(), customerID, termID);
                }
            }
            catch (Exception ex)
            {
                ErrorTracker errorTrace = new ErrorTracker();
                errorTrace.WriteErrorLog("NetgearClientService.asmx.cs", "UpdateCuustomerTermsCondition()", "", ex.Message, ex.StackTrace, "Error");
                errorTrace = null;
                return null;
            }
            return termsConditionsUpdate;
        }

        #endregion
    }

    public class KBArticles
    {
        public string product { get; set; }
        public int product_id { get; set; }
        public List<CategoryAnswers> productCategories { get; set; }
    }

    public class CategoryAnswers
    {
        public int category_id { get; set; }
        public string category_name { get; set; }
        public string category_description { get; set; }
        public List<ProductAnswers> cats_answers { get; set; }
    }
    public class ProductKB
    {
        public string product { get; set; }
        public int product_id { get; set; }
        public List<ProductCategory> productCategories { get; set; }
        public List<ProductAnswers> answers { get; set; }
    }

    public class ProductCategory
    {
        public int category_id { get; set; }
        public string category_name { get; set; }
        public string category_description { get; set; }
    }

    public class ProductAnswers
    {
        public string id { get; set; }
        public string title { get; set; }
        public string desc { get; set; }
        public string categories { get; set; }

    }

    #region Product
    /// <summary>
    /// Collection of product with customer registered
    /// </summary>
    public class ProductItems
    {
        public int RegistrationId
        {
            get;
            set;
        }

        public string SerialNo
        {
            get;
            set;
        }

        public string ProductName
        {
            get;
            set;
        }

        public string PurchaseDate
        {
            get;
            set;
        }

        public string CountryPurchase
        {
            get;
            set;
        }

        public string ProductExpired
        {
            get;
            set;
        }

        public string SwExpired
        {
            get;
            set;
        }

        public string ProductWarranty
        {
            get;
            set;
        }

        public string SWChatExpiry { get; set; }

        public string SWOTSExpiry { get; set; }

        public string SWPhoneExpiry { get; set; }

        public bool SupportChatAvailable { get; set; }

        public bool SupportOTSAvailable { get; set; }

        public bool SupportPhoneAvailable { get; set; }

    }
    #endregion

    #region Customer Contract Items

    public class CustomerContractItems
    {
        public string ContractId { get; set; }

        public string Type { get; set; }

        public string PurchaseDate { get; set; }
        public string PurchasedFrom { get; set; }
        public string ExpiryDate { get; set; }
        public string Linkedto { get; set; }
        public string Available { get; set; }
        public string Status { get; set; }
        public string RemainingDays { get; set; }
        //public string SessionId
        //{
        //    get;
        //    set;
        //}

        //public string CustomerId
        //{
        //    get;
        //    set;
        //}

        //public string CustomerEmail
        //{
        //    get;
        //    set;
        //}
        //public string Country
        //{
        //    get;
        //    set;
        //}
        //public string PortalId
        //{
        //    get;
        //    set;
        //}
    }

    #endregion

    #region CaseItems
    public class CaseItems
    {
        public int CaseId
        {
            get;
            set;
        }

        public int CaseNo
        {
            get;
            set;
        }

        public string CaseProduct
        {
            get;
            set;
        }

        public string CaseSummary
        {
            get;
            set;
        }

        public string CaseProblem
        {
            get;
            set;
        }

        public string CaseCause
        {
            get;
            set;
        }

        public string CaseNotes
        {
            get;
            set;
        }

        public string CaseSource
        {
            get;
            set;
        }

        public string CaseAssignTo
        {
            get;
            set;
        }

        public int CaseQueueId
        {
            get;
            set;
        }

        public string CaseStatus
        {
            get;
            set;
        }
        public string ScheduleDate
        {
            get;
            set;
        }
        public string ScheduleTime
        {
            get;
            set;
        }
        public string ScheduleTimeStamp
        {
            get;
            set;
        }
        public string Phone
        {
            get;
            set;
        }
        public string RegistrationId
        {
            get;
            set;
        }
        public string SerialNo
        {
            get;
            set;
        }

        public DateTime CreatedDate
        {
            get;
            set;
        }

        public DateTime UpdatedDate
        {
            get;
            set;
        }
    }
    #endregion

    #region Customer Items
    public class CustomerItems
    {
        public string SessionId
        {
            get;
            set;
        }

        public string CustomerId
        {
            get;
            set;
        }

        public string CustomerEmail
        {
            get;
            set;
        }
        public string PortalId
        {
            get;
            set;
        }
        public string Country
        {
            get;
            set;
        }
        public string FirstName
        {
            get;
            set;
        }
        public string LastName
        {
            get;
            set;
        }
        public bool EmailConfirmed { get; set; }
    }

    #endregion

    #region public class ContractInfo
    public class ContractInfo
    {
        public int ContractAvailability
        {
            get;
            set;
        }

        public int RemainingDays
        {
            get;
            set;
        }
        public int ContractId
        {
            get;
            set;
        }

    }
    #endregion

    #region MessageCenter
    public class PublishedMessage
    {
        public string MessageTitle
        {
            get;
            set;
        }

        public string CategoryName
        {
            get;
            set;
        }

        public string ShortDescription
        {
            get;
            set;
        }

        public int MessageID
        {
            get;
            set;
        }
        public bool Isimportant
        {
            get;
            set;
        }

        public DateTime Publishedon
        {
            get;
            set;
        }

        public string description
        {
            get;
            set;

        }
        public string referenceURL
        {
            get;
            set;

        }

    }


}
    #endregion

#region KnowledgeBase
public class KBSearchResponse
{
    int totalResults;

    public int TotalResults
    {
        get { return totalResults; }
        set { totalResults = value; }
    }

    long id;

    public long ID
    {
        get { return id; }
        set { id = value; }
    }

    string title;

    public string Title
    {
        get { return title; }
        set { title = value; }
    }

    string excerpt;

    public string Excerpt
    {
        get { return excerpt; }
        set { excerpt = value; }
    }

    string url;

    public string Url
    {
        get { return url; }
        set { url = value; }
    }

    long contentOriginID;

    public long ContentOriginID
    {
        get { return contentOriginID; }
        set { contentOriginID = value; }
    }

    string contentOriginName;

    public string ContentOriginName
    {
        get { return contentOriginName; }
        set { contentOriginName = value; }
    }
}
#endregion

#region FeedBack
public class MessageFeedBackDetails
{
    public int CustomrId { get; set; }
    public string Message { get; set; }
    public decimal Rating { get; set; }
}
#endregion

#region "TimeZoneDetails"

public class TimeZoneDetails
{
    /// <summary>
    /// Used to get/set TimeZoneID
    /// </summary>
    public int TimeZoneID { get; set; }
    /// <summary>
    /// Used to get/set TimeZone
    /// </summary>
    public string TimeZone { get; set; }
    /// <summary>
    /// Used to get/set Time
    /// </summary>
    public string Time { get; set; }
    /// <summary>
    /// Used to get/set Country
    /// </summary>
    public string Country { get; set; }
}
#endregion

#region "NetWorkMapDetails"

public class NetWorkDeviceDetails
{
    /// <summary>
    /// Get / Set the IPAddress
    /// </summary>
    public string IPAddress { get; set; }
    /// <summary>
    /// Get / Set the DeviceDetails
    /// </summary>
    public string DeviceDetails { get; set; }


}

#endregion

#region "Device Location"
public class DeviceLocationDetails
{
    /// <summary>
    /// Get / Set the Device Latitude
    /// </summary>
    public string DeviceLatitude { get; set; }
    /// <summary>
    /// Get / Set the Device Logitude
    /// </summary>
    public string DeviceLongitude { get; set; }
    /// <summary>
    /// Get / Set the Tracking Time
    /// </summary>
    public string TrackFromTime { get; set; }
    /// <summary>
    /// Get / Set the Tracking Time
    /// </summary>
    public string TrackToime { get; set; }

    public string TimeDiff { get; set; }
}

#endregion

#region "Phone Settings"
public class PhoneSettingDetails
{
    public int CustomerID { get; set; }
    public bool IsPhoneTrack { get; set; }
}
#endregion

#region ParentalControl
public class Parental
{

    int slno;
    string blocked = string.Empty;
    string type = string.Empty;
    string blockedOn = string.Empty;
    int customer_ID;

    public int Slno
    {
        get { return slno; }
        set { slno = value; }
    }
    public string Blocked
    {
        get { return blocked; }
        set { blocked = value; }
    }
    public string Type
    {
        get { return type; }
        set { type = value; }
    }

    [DataMember(Name = "BlockedOn")]
    public string BlockedOnForSerialization { get; set; }

    public DateTime BlockedOn { get; set; }

    [OnSerializing]
    void OnSerializing(StreamingContext ctx)
    {
        this.BlockedOnForSerialization = this.BlockedOn.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
    }
    [OnDeserializing]
    void OnDeserializing(StreamingContext ctx)
    {
        this.BlockedOnForSerialization = "1900-01-01";
    }
    [OnDeserialized]
    void OnDeserialized(StreamingContext ctx)
    {
        this.BlockedOn = DateTime.ParseExact(this.BlockedOnForSerialization, "MM/dd/yyyy", CultureInfo.InvariantCulture);
    }
    public int Customer_ID
    {
        get { return customer_ID; }
        set { customer_ID = value; }
    }
}
#endregion

#region "Phone Settings"
public class CommunitySerachDetails
{
    public string Link { get; set; }
    public string PostedTime { get; set; }
    public string Title { get; set; }
}
#endregion

public enum HttpVerb
{
    GET,
    POST,
    PUT,
    DELETE
}

public class RestClient
{
    public string EndPoint { get; set; }
    public HttpVerb Method { get; set; }
    public string ContentType { get; set; }
    public string PostData { get; set; }

    public RestClient()
    {
        EndPoint = "";
        Method = HttpVerb.GET;
        ContentType = "text/xml";
        PostData = "";
    }
    public RestClient(string endpoint)
    {
        EndPoint = endpoint;
        Method = HttpVerb.GET;
        ContentType = "text/xml";
        PostData = "";
    }
    public RestClient(string endpoint, HttpVerb method)
    {
        EndPoint = endpoint;
        Method = method;
        ContentType = "text/xml";
        PostData = "";
    }

    public RestClient(string endpoint, HttpVerb method, string postData)
    {
        EndPoint = endpoint;
        Method = method;
        ContentType = "text/xml";
        PostData = postData;
    }


    public string MakeRequest(string parameters)
    {
        var request = (HttpWebRequest)WebRequest.Create(EndPoint + parameters);

        request.Method = Method.ToString();
        request.ContentLength = 0;
        request.ContentType = ContentType;

        if (!string.IsNullOrEmpty(PostData) && Method == HttpVerb.POST)
        {
            var encoding = new UTF8Encoding();
            var bytes = Encoding.GetEncoding("iso-8859-1").GetBytes(PostData);
            request.ContentLength = bytes.Length;

            using (var writeStream = request.GetRequestStream())
            {
                writeStream.Write(bytes, 0, bytes.Length);
            }
        }

        using (var response = (HttpWebResponse)request.GetResponse())
        {
            var responseValue = string.Empty;

            if (response.StatusCode != HttpStatusCode.OK)
            {
                var message = String.Format("Request failed. Received HTTP {0}", response.StatusCode);
                throw new ApplicationException(message);
            }

            // grab the response
            using (var responseStream = response.GetResponseStream())
            {
                if (responseStream != null)
                    using (var reader = new StreamReader(responseStream))
                    {
                        responseValue = reader.ReadToEnd();
                    }
            }

            return responseValue;
        }
    }

} // class
