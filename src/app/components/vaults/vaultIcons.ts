import {
  Shield,
  Lock,
  Key,
  Folder,
  Globe,
  Mail,
  User,
  FileText,
  Star,
  Heart,
  type LucideIcon,
} from "lucide-react"

export const VAULT_ICONS: Record<string, LucideIcon> = {
  shield: Shield,
  lock: Lock,
  key: Key,
  folder: Folder,
  globe: Globe,
  mail: Mail,
  user: User,
  file: FileText,
  star: Star,
  heart: Heart,
}

export const VAULT_ICON_NAMES = Object.keys(VAULT_ICONS)

export function getVaultIcon(iconName: string): LucideIcon {
  return VAULT_ICONS[iconName] ?? Shield
}

export const VAULT_COLORS = [
  { bg: "#7c3aed", ic: "#ffffff" },  // Purple
  { bg: "#2563eb", ic: "#ffffff" },  // Blue
  { bg: "#059669", ic: "#ffffff" },  // Green
  { bg: "#d97706", ic: "#ffffff" },  // Amber
  { bg: "#dc2626", ic: "#ffffff" },  // Red
  { bg: "#0891b2", ic: "#ffffff" },  // Cyan
  { bg: "#7c2d12", ic: "#ffffff" },  // Brown
  { bg: "#4f46e5", ic: "#ffffff" },  // Indigo
  { bg: "#be185d", ic: "#ffffff" },  // Pink
  { bg: "#374151", ic: "#ffffff" },  // Gray
]
