module.exports = function(deployTarget) {  
  return {
    pagefront: {
      app: 'mdm-application-app',
      key: process.env.PAGEFRONT_KEY
    }
  };
};
