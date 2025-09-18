import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 4 13H2a9 9 0 0 0 18 0h-2a7 7 0 0 1-7 7Z" />
      <path d="M12 14a7 7 0 0 0-7-7H2a9 9 0 0 1 18 0h-2a7 7 0 0 0-7 7Z" />
    </svg>
  );
}
