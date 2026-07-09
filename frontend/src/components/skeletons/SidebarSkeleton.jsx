import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-max shrink-0 min-[400px]:w-72 min-[530px]:w-80 min-[751px]:w-72 border-r border-base-300 
    flex flex-col transition-all duration-200 min-w-0"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-3 min-[400px]:p-5">
        <div className="flex items-center gap-2 min-w-0">
          <Users className="w-6 h-6 shrink-0" />
          <span className="font-medium truncate">Contacts</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3 min-w-0">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full min-w-0 p-2 min-[400px]:p-3 flex items-center gap-2 min-[400px]:gap-3">
            {/* Avatar skeleton */}
            <div className="relative shrink-0">
              <div className="skeleton size-12 rounded-full" />
            </div>

            <div className="text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-full max-w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;