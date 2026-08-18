/**
 * Линейни икони за 12-те главни категории.
 * Нарочно едно-цветни (currentColor) и с еднаква оптична тежест,
 * за да изглеждат като един комплект в лентата.
 */
interface Props {
  name: string;
  className?: string;
}

const PATHS: Record<string, React.ReactNode> = {
  building: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-5h6v5" />
      <path d="M9 11h.01M12 11h.01M15 11h.01" />
    </>
  ),
  paint: (
    <>
      <path d="M4 8V5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v3" />
      <rect x="3" y="8" width="15" height="5" rx="1" />
      <path d="M18 10h2a1 1 0 0 1 1 1v2a3 3 0 0 1-3 3h-1" />
      <path d="M11 16v2a2 2 0 0 1-2 2H8" />
    </>
  ),
  tool: (
    <>
      <path d="M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.1 2.1 0 0 1-3-3l9.4-9.4a4 4 0 0 0-2-2z" />
      <path d="M17.5 3.5 21 7l-2 2-3.5-3.5z" />
    </>
  ),
  pipe: (
    <>
      <path d="M4 6h6a4 4 0 0 1 4 4v4a4 4 0 0 0 4 4h2" />
      <rect x="2" y="3.5" width="3" height="5" rx="0.5" />
      <rect x="19" y="15.5" width="3" height="5" rx="0.5" />
      <path d="M10 10h4" />
    </>
  ),
  flame: (
    <>
      <path d="M12 22c3.9 0 6-2.6 6-5.6 0-3.9-3.4-5.3-3.4-8.4 0-1.4.6-2.6 1.4-3.6-3.6.5-6 3.2-6 6.3 0 1.6.7 2.6.7 3.6 0 1.1-.9 1.8-1.8 1.8-1 0-1.7-.7-1.9-1.7-.6.9-1 2-1 3.2C6 19.4 8.1 22 12 22z" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6V16h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z" />
    </>
  ),
  bath: (
    <>
      <path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3z" />
      <path d="M6 12V5.5A1.5 1.5 0 0 1 7.5 4c.9 0 1.5.7 1.5 1.6" />
      <path d="M6 19l-1 2M18 19l1 2" />
    </>
  ),
  floor: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M3 10h18M3 15h18M9 4v6M15 10v5M9 15v5" />
    </>
  ),
  helmet: (
    <>
      <path d="M3 16a9 9 0 0 1 18 0" />
      <rect x="2" y="16" width="20" height="3.5" rx="1.5" />
      <path d="M10 7.3V4.6a.6.6 0 0 1 .6-.6h2.8a.6.6 0 0 1 .6.6v2.7" />
    </>
  ),
  car: (
    <>
      <path d="M3 13.5 5 8a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 8l2 5.5" />
      <path d="M3 13.5h18V18a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1h-11v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4.5z" />
      <path d="M6.5 16h.01M17.5 16h.01" />
    </>
  ),
  garden: (
    <>
      <path d="M12 21v-7" />
      <path d="M12 14c0-3.3-2.2-6-5-6 0 3.3 2.2 6 5 6z" />
      <path d="M12 14c0-3.9 2.7-7 6-7 0 3.9-2.7 7-6 7z" />
      <path d="M8 21h8" />
    </>
  ),
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
      <path d="M10 21v-6h4v6" />
    </>
  ),
};

export function CategoryIcon({name, className = 'size-5'}: Props) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
