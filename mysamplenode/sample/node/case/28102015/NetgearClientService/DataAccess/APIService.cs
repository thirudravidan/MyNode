using System;
using System.Configuration;
using System.ServiceModel;
using System.ServiceModel.Configuration;
using NetgearClientService.NetgearService;


namespace NetgearClientService.DataAccess
{
    public class APIService : IDisposable
    {
        #region Fields

        private static IServices _APIService;                       // Static field for API Service
        private static ChannelFactory<IServices> _channelFactory;   // Static field for Channel facory

        #endregion

        #region Public

        /// <summary>
        /// Connect service and return channel factory.
        /// it is later part. 
        /// </summary>
        public IServices Instance
        {
            get
            {
                if (_APIService == null)
                {
                    _channelFactory = new ChannelFactory<IServices>("BasicHttpBinding_IServices");
                    _APIService = _channelFactory.CreateChannel();
                    ((IClientChannel)_APIService).Open();
                }
                return _APIService;
            }
        }

        /// <summary>
        /// Get the API key from app.config
        /// </summary>
        /// <returns>
        /// return the API key with valid service.
        /// </returns>
        public static string GetAPIString()
        {
            return ConfigurationManager.AppSettings.Get("ApiKey");
        }

        #endregion

        #region Private
        /// <summary>
        /// Dispose the channel factory
        /// </summary>
        void IDisposable.Dispose()
        {
        }
        #endregion
    }
}