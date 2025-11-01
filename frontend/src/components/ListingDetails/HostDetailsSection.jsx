// src/components/ListingDetails/HostDetailsSection.jsx
export default function HostDetailsSection({ host = {}, user = {} }) { // user is for fallback
  return (
    <section className="mb-6">
      <h2 className="text-2xl font-semibold mb-3">Meet your host</h2>
      <div className="flex items-start gap-4">
        <img
          src={host.profileImagePath || host.avatar?.secure_url || user?.avatar?.secure_url}
          alt="host"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold">{host.firstName} {host.lastName}</div>
          <div className="text-sm text-gray-600">{host.shortBio || 'Hi! I love hosting guests.'}</div>

          <div className="mt-3">
            <div>Response rate: {host.responseRate || '98%'}</div>
            <div>Responds within: {host.respondsIn || 'an hour'}</div>
            <button className="mt-2 px-3 py-2 bg-white border rounded">
              Message host
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}