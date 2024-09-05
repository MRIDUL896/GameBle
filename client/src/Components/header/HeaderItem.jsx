const HeaderItem = ({ item, currMenu, handleClick }) => {
  return (
    <div
      onClick={() => handleClick(item)}
      className={`cursor-pointer px-4 py-2 border-2 border-black rounded-lg transition duration-300 
      ${currMenu === item 
        ? "bg-green-700 text-white scale-105 shadow-lg" 
        : "hover:bg-green-600 hover:text-white"
      }`}
    >
      {item}
    </div>
  );
};

export default HeaderItem;
