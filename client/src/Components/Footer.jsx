import icon from '../assets/MainIcon.png';

export default function Footer() {
    return (
      <footer className="bg-black text-white flex flex-col justify-center items-center">
         <div className="flex items-center justify-center p-5 gap-5 cursor-pointer">
                <img src={icon} alt="" className="h-12" />
            </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact us</h3>
              <p>Phone: +91 0000000000</p>
              <p>Email: demo@gmail.com</p>
              <p>Address: Gurgaon, India</p>
            </div>
            <div>
              <h1>
                **Disclaimer: this is just a test website**
              </h1>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Feedbacks and suggestions</h3>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your thoughts"
                  className="flex-grow p-2 rounded-l text-gray-800"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r">
                  Send
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2024 GameAble. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}