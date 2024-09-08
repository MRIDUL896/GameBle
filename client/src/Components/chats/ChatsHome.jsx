import Sidebar from './Sidebar';
import CurrentChat from './CurrentChat';

const ChatsHome = () => {

    return (
        <div className="flex w-full h-screen overflow-hidden m-4 p-8 bg-red-600">
            <Sidebar/>
            <CurrentChat/>
        </div>
    );
};

export default ChatsHome;
