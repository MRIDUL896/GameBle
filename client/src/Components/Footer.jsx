import icon from '../assets/Title.png';

export default function Footer() {
    return (
      <footer className="bg-black text-white flex flex-col justify-center items-center">
         <div className="flex items-center justify-center p-5 gap-5 cursor-pointer">
                <img src={icon} alt="" className="h-12" />
                <h1 className="text-blue-700 text-4xl font-bold">GameBle</h1>
            </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact us</h3>
              <p>Phone: +91 0000000000</p>
              <p>Email: demo@gmail.com</p>
              <p>Address: Mumbai, India</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#services" className="hover:text-blue-400">Services</a></li>
                <li><a href="#projects" className="hover:text-blue-400">Projects</a></li>
                <li><a href="#team" className="hover:text-blue-400">Team</a></li>
                <li><a href="#faq" className="hover:text-blue-400">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
              <p className="mb-4">Subscribe to our newsletter for updates</p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow p-2 rounded-l text-gray-800"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r">
                  Subscribe
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