"use client";

import Link from "next/link";

export default function NavDropdown({ item, subItems, navLinkStyles, underlineStyles }) {
  return (
    // The 'group' class here controls the hover state for everything inside
    <div className="relative group pb-4 mt-4">
      
      {/* Parent Link */}
      <Link 
        href={item.href} 
        className={`${navLinkStyles} relative group-hover:text-bold-blue`}
      >
        {item.name}
        <span className={`${underlineStyles} group-hover:w-full`} />
      </Link>

      {/* Dropdown Container */}
      <div className="absolute top-full -left-20 w-[400px] bg-white rounded-2xl shadow-xl 
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                      transition-all duration-300 transform group-hover:translate-y-0 translate-y-4
                      border border-blue-100 overflow-hidden z-50">
        <div className="p-6 flex flex-col gap-6">
          {subItems.map((subItem, subIndex) => (
            <Link 
              key={subIndex} 
              href={subItem.href}
              className="flex items-start gap-4 group/item text-darker-bold-blue hover:text-bold-blue"
            >
              <div className="mt-1">
                {subItem.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-songer font-bold text-xl flex items-center">
                  {subItem.name} 
                  {/* Arrow animation */}
                  <span className="ml-2 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-sm">
                    <img 
                      src="/images/graphic_arrow.svg" 
                      alt="toggle"
                      className={`w-3 h-auto object-contain`}
                    />
                  </span>
                </span>
                <span className="font-work-sans text-sm font-semibold leading-tight mt-1">
                  {subItem.desc}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}