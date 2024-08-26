const HeaderItem = ({ item, currMenu, handleClick}) => {
    return (
      <div
        onClick={() => handleClick(item)}
        className={`cursor-pointer px-2 py-1 rounded-xl ${currMenu === item ? "bg-violet-700 text-white" : ""}`}
      >
        {item}
      </div>
    );
  };
  
  export default HeaderItem;