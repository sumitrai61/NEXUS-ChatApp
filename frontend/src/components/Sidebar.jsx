
import { useEffect } from "react";  
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { normalizeId } from "../lib/utils";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    unreadCounts,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const{ onlineUsers } = useAuthStore();
  const [showOnlineOnly,setShowOnlineOnly] = useState(false); 

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser, subscribeToMessages, unsubscribeFromMessages]);
  
  const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users;
  if(isUsersLoading) return <SidebarSkeleton />
  return (
     <aside className="h-full w-max shrink-0 md:w-72 border-r border-base-300 flex flex-col transition-all duration-200 min-w-0">
      <div className="border-b border-base-300 w-full p-3 md:p-5">
        <div className="flex items-center gap-2 min-w-0">
          <Users className="size-6 shrink-0" />
          <span className="font-medium truncate">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
         
          <div className="mt-3 flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2">
          <label className="cursor-pointer flex items-center gap-2 min-w-0">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm shrink-0"
            />
            <span className="text-xs md:text-sm truncate">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500 shrink-0">({onlineUsers.length - 1} online)</span>
        </div>

      </div>

      <div className="overflow-y-auto w-full py-3 min-w-0">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full min-w-0 p-2 md:p-3 flex items-center gap-2 md:gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative shrink-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="text-left min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                {unreadCounts[normalizeId(user._id)] > 0 && (
                  <span className="badge badge-primary badge-sm min-w-5 h-5 rounded-full shrink-0">
                    {unreadCounts[normalizeId(user._id)]}
                  </span>
                )}
              </div>
              <div className="text-sm text-zinc-400 truncate">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
        
    </div>
  </aside> 
  );
};

export default Sidebar;
