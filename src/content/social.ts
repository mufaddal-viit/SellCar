/** Primary contact numbers — single source of truth (no env dependency). */
export const contactNumbers = {
  /** Displayed + used for tel: links */
  phone: '+971503960617',
  /** International format (no +) for wa.me deep links */
  whatsapp: '971503960617',
};

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export const socialLinks: SocialLink[] = [
  {
    platform: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/buyndriveusedcars?igsh=YWttbjgxZ3dianFt&utm_source=qr',
  },
  {
    platform: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/share/18dCeUbmJp/?mibextid=wwXIfr',
  },
  {
    // TODO: confirm the exact TikTok handle/URL with the client.
    platform: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@buyndriveusedcars',
  },
];
