export interface GeoInfo {
  country: string;
  region: string;
  city: string;
  org: string; // ISP or, for many corporate/VPN connections, the actual company name
}

const EMPTY_GEO: GeoInfo = { country: '', region: '', city: '', org: '' };

// Uses ip-api.com's free tier (no API key, ~45 requests/minute). This is
// best-effort: home internet connections resolve to an ISP name, not a
// company. Corporate networks and some VPNs often do resolve to the real
// organization name, which is the closest free approximation of "which
// company this visitor is browsing from" without paid reverse-IP services.
export async function lookupGeo(ip: string): Promise<GeoInfo> {
  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return EMPTY_GEO;
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,org,isp`);
    if (!res.ok) return EMPTY_GEO;
    const data = await res.json() as {
      status: string;
      country?: string;
      regionName?: string;
      city?: string;
      org?: string;
      isp?: string;
    };
    if (data.status !== 'success') return EMPTY_GEO;
    return {
      country: data.country || '',
      region: data.regionName || '',
      city: data.city || '',
      org: data.org || data.isp || ''
    };
  } catch {
    return EMPTY_GEO;
  }
}
