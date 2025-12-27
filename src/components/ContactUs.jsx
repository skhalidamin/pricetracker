const ContactUs = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Contact Us</h2>

      <div className="max-w-md mx-auto">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">K</span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Khalid</h3>
          <p className="text-gray-600 mb-4">Developer & Creator</p>
          
          {/* Contact Info */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-gray-600 text-sm mb-1">Email</p>
            <a 
              href="mailto:skhalidamin@gmail.com" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              skhalidamin@gmail.com
            </a>
          </div>
        </div>

        {/* Message */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Have questions or feedback? Feel free to reach out!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
