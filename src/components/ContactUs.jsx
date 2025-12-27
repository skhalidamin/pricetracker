const ContactUs = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-2xl mx-auto">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Contact</h2>
        <p className="text-sm text-gray-500 mt-1">Get in touch with the developer</p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-white">K</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Khalid</h3>
              <p className="text-sm text-gray-600">Developer & Creator</p>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Email</p>
            <a 
              href="mailto:skhalidamin@gmail.com" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              skhalidamin@gmail.com
            </a>
          </div>
        </div>

        {/* Message */}
        <div className="mt-6 text-center">{" "}
          <p className="text-sm text-gray-600">
            Have questions or feedback? Feel free to reach out!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
