import { useNavigate } from 'react-router-dom';

const Friend = ({friend}) => {

    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/u/${id}`);
    }

    return (
        <li
            
            className="flex bg-gray-950 hover:bg-gray-600 transition-colors rounded-lg p-4 text-center cursor-pointer ring-2 ring-transparent hover:ring-blue-400"
            onClick={() => handleClick(friend._id)}>
            <div className="flex items-center justify-center mb-4">
                <img
                    src={friend?.profilePicture || 'https://png.pngtree.com/thumb_back/fh260/background/20230712/pngtree-3d-rendering-of-online-sports-betting-concept-image_3831784.jpg'}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-4 border-gray-700"
                />
            </div>
            <div>
                <h3 className="text-lg text-blue-200 mb-2">{friend.name}</h3>
                <p className="text-sm text-gray-300">Click to view profile</p>
            </div>
        </li>
    )
}

export default Friend;