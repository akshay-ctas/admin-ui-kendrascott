import type { Product, ProductImage, Variant } from "./types";

// ── Data ────────────────────────────────────────────────────────────
export const initialData = {
  data: [
    {
      _id: "699f01d4310309c765de8c98",
      title: "Diamond Necklace",
      slug: "diamond-necklace",
      description: "Premium diamond necklace",
      price: 49999,
      status: "ACTIVE" as const,
      sortOrder: 0,
      tags: ["luxury", "diamond"],
      metaTitle: "Diamond Necklace",
      metaDescription: "Premium diamond necklace",
      createdAt: "2026-02-25T14:06:12.199Z",
      updatedAt: "2026-02-25T14:06:12.199Z",
      categories: [{ _id: "c1", name: "Necklace" }],
      images: [
        {
          _id: "img1",
          url: "https://picsum.photos/seed/v1/200",
          altText: "Rose Gold",
          isPrimary: true,
          position: 0,
          variantId: "v1",
        },
        {
          _id: "img2",
          url: "https://picsum.photos/seed/v1b/200",
          altText: "Rose Gold Side",
          isPrimary: false,
          position: 1,
          variantId: "v1",
        },
        {
          _id: "img3",
          url: "https://picsum.photos/seed/v2/200",
          altText: "Yellow Gold",
          isPrimary: true,
          position: 0,
          variantId: "v2",
        },
        {
          _id: "img4",
          url: "https://picsum.photos/seed/v3/200",
          altText: "White Gold",
          isPrimary: true,
          position: 0,
          variantId: "v3",
        },
      ],
      variants: [
        {
          _id: "v1",
          sku: "DN-RG-18K",
          color: "Rose Gold",
          metalType: "18K Gold",
          stoneType: "Diamond",
          size: "16in",
          stock: 5,
          price: 49999,
        },
        {
          _id: "v2",
          sku: "DN-YG-18K",
          color: "Yellow Gold",
          metalType: "18K Gold",
          stoneType: "Diamond",
          size: "18in",
          stock: 3,
          price: 52000,
        },
        {
          _id: "v3",
          sku: "DN-WG-18K",
          color: "White Gold",
          metalType: "18K Gold",
          stoneType: "Diamond",
          size: "20in",
          stock: 7,
          price: 54500,
        },
      ],
    },
    {
      _id: "699f015e310309c765de8c83",
      title: "Gold Diamond Ring",
      slug: "gold-diamond-ring",
      description: "18K gold diamond ring with premium cut stones",
      price: 35000,
      status: "ACTIVE" as const,
      sortOrder: 1,
      tags: ["gold", "ring"],
      metaTitle: "Gold Ring",
      metaDescription: "18K Gold Ring",
      createdAt: "2026-02-20T14:04:14.346Z",
      updatedAt: "2026-02-20T14:04:14.346Z",
      categories: [{ _id: "c2", name: "Rings" }],
      images: [
        {
          _id: "img5",
          url: "https://picsum.photos/seed/r1/200",
          altText: "Size 6",
          isPrimary: true,
          position: 0,
          variantId: "r1",
        },
        {
          _id: "img6",
          url: "https://picsum.photos/seed/r2/200",
          altText: "Size 7",
          isPrimary: true,
          position: 0,
          variantId: "r2",
        },
      ],
      variants: [
        {
          _id: "r1",
          sku: "GDR-S6",
          color: "Yellow Gold",
          metalType: "18K Gold",
          stoneType: "Diamond",
          size: "6",
          stock: 8,
          price: 35000,
        },
        {
          _id: "r2",
          sku: "GDR-S7",
          color: "Yellow Gold",
          metalType: "18K Gold",
          stoneType: "Ruby",
          size: "7",
          stock: 4,
          price: 37000,
        },
      ],
    },
    {
      _id: "699ee0ebfb98e8c0e41a25f3",
      title: "Silver Bracelet",
      slug: "silver-bracelet",
      description: "Handcrafted silver bracelet",
      price: 4500,
      status: "DRAFT" as const,
      sortOrder: 2,
      tags: ["silver"],
      metaTitle: "",
      metaDescription: "",
      createdAt: "2026-02-18T08:00:00.000Z",
      updatedAt: "2026-02-18T08:00:00.000Z",
      categories: [],
      images: [],
      variants: [
        {
          _id: "b1",
          sku: "SB-SM",
          color: "Silver",
          metalType: "Sterling Silver",
          stoneType: "None",
          size: "S",
          stock: 12,
          price: 4500,
        },
        {
          _id: "b2",
          sku: "SB-MD",
          color: "Silver",
          metalType: "Sterling Silver",
          stoneType: "None",
          size: "M",
          stock: 9,
          price: 4500,
        },
        {
          _id: "b3",
          sku: "SB-LG",
          color: "Oxidized",
          metalType: "Sterling Silver",
          stoneType: "None",
          size: "L",
          stock: 6,
          price: 4800,
        },
      ],
    },
  ],
  meta: { limit: 10, page: 1, total: 3, totalPages: 1 },
};

// ── Helpers ─────────────────────────────────────────────────────────
export const fmt = (n: number): string =>
  "₹" + Number(n).toLocaleString("en-IN");

export const fmtDate = (d: string): string =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });

// ── Icons ────────────────────────────────────────────────────────────
export const Chevron = ({ open }: { open: boolean }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    style={{
      transition: "transform .2s",
      transform: open ? "rotate(90deg)" : "rotate(0deg)",
    }}
  >
    <path
      d="M5.5 3.5l4 4-4 4"
      stroke="#94a3b8"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EditIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const SaveIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const XIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── UI Components ────────────────────────────────────────────────────

export const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, [string, string]> = {
    ACTIVE: ["#dcfce7", "#15803d"],
    DRAFT: ["#fef9c3", "#a16207"],
  };
  const [bg, color] = map[status] ?? ["#f1f5f9", "#64748b"];
  return (
    <span
      style={{
        background: bg,
        color,
        padding: "2px 9px",
        borderRadius: 20,
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.6,
        textTransform: "uppercase",
      }}
    >
      {status}
    </span>
  );
};

interface BtnProps {
  onClick: () => void;
  color?: string;
  outline?: boolean;
  children: React.ReactNode;
}

export const Btn = ({
  onClick,
  color = "#6366f1",
  outline = false,
  children,
}: BtnProps) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 10px",
      borderRadius: 6,
      fontSize: 11.5,
      fontWeight: 600,
      cursor: "pointer",
      transition: "opacity .15s",
      background: outline ? "transparent" : color,
      color: outline ? color : "#fff",
      border: `1.5px solid ${color}`,
    }}
    onMouseEnter={(e) => (e.currentTarget.style.opacity = ".8")}
    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
  >
    {children}
  </button>
);

interface EInputProps {
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  style?: React.CSSProperties;
}

export const EInput = ({
  value,
  onChange,
  type = "text",
  style = {},
}: EInputProps) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      width: "100%",
      padding: "4px 7px",
      border: "1.5px solid #6366f1",
      borderRadius: 5,
      fontSize: 12,
      background: "#fff",
      color: "#111827",
      outline: "none",
      boxSizing: "border-box",
      ...style,
    }}
  />
);

interface ESelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
}

export const ESelect = ({ value, onChange, options }: ESelectProps) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      padding: "4px 7px",
      border: "1.5px solid #6366f1",
      borderRadius: 5,
      fontSize: 12,
      background: "#fff",
      color: "#111827",
      outline: "none",
    }}
  >
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

export const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 10,
      color: "#94a3b8",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 3,
    }}
  >
    {children}
  </div>
);
