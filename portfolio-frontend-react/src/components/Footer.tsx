import { getAdminUrl } from '../api/client';

export default function Footer() {
  const adminUrl = getAdminUrl();

  return (
    <footer>
      <div className="container footer-inner">
        <span>© 2026 Mahidhar — built with glass, coffee, and a little too much backdrop-filter.</span>

        {adminUrl && (
          <a href={adminUrl} className="admin-link" target="_blank" rel="noopener noreferrer">Admin</a>
        )}
      </div>
    </footer>
  );
}
