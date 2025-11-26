const members = [
  {
    name: 'Mehmet Yılmaz',
    role: 'Kurucu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=460&h=460&fit=crop',
  },
  {
    name: 'Ayşe Demir',
    role: 'Frontend Geliştirici',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=460&h=460&fit=crop',
  },
  {
    name: 'Ahmet Kaya',
    role: 'Frontend Geliştirici',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=460&h=460&fit=crop',
  },
  {
    name: 'Zeynep Arslan',
    role: 'Backend Geliştirici',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=460&h=460&fit=crop',
  },
];

export default function TeamSimple() {
  return (
    <section className="py-12 md:py-32">
      <div className="mx-auto max-w-3xl px-8 lg:px-0">
        <h2 className="mb-8 text-4xl font-bold text-slate-900 dark:text-white md:mb-16 lg:text-5xl">
          Ekibimiz
        </h2>

        <div>
          <h3 className="mb-6 text-lg font-medium text-slate-900 dark:text-white">
            Liderlik
          </h3>
          <div className="grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800 py-6 md:grid-cols-4">
            {members.map((member, index) => (
              <div key={index}>
                <div className="bg-white dark:bg-dark-light size-20 rounded-full border border-slate-200 dark:border-slate-700 p-0.5 shadow shadow-zinc-950/5">
                  <img
                    className="aspect-square rounded-full object-cover"
                    src={member.avatar}
                    alt={member.name}
                    height="460"
                    width="460"
                    loading="lazy"
                  />
                </div>
                <span className="mt-2 block text-sm text-slate-900 dark:text-white">
                  {member.name}
                </span>
                <span className="text-slate-600 dark:text-gray-300 block text-xs">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-6 text-lg font-medium text-slate-900 dark:text-white">
            Mühendislik
          </h3>
          <div className="grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800 py-6 md:grid-cols-4">
            {members.map((member, index) => (
              <div key={index}>
                <div className="bg-white dark:bg-dark-light size-20 rounded-full border border-slate-200 dark:border-slate-700 p-0.5 shadow shadow-zinc-950/5">
                  <img
                    className="aspect-square rounded-full object-cover"
                    src={member.avatar}
                    alt={member.name}
                    height="460"
                    width="460"
                    loading="lazy"
                  />
                </div>
                <span className="mt-2 block text-sm text-slate-900 dark:text-white">
                  {member.name}
                </span>
                <span className="text-slate-600 dark:text-gray-300 block text-xs">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-6 text-lg font-medium text-slate-900 dark:text-white">
            Pazarlama
          </h3>
          <div className="grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800 py-6 md:grid-cols-4">
            {members.map((member, index) => (
              <div key={index}>
                <div className="bg-white dark:bg-dark-light size-20 rounded-full border border-slate-200 dark:border-slate-700 p-0.5 shadow shadow-zinc-950/5">
                  <img
                    className="aspect-square rounded-full object-cover"
                    src={member.avatar}
                    alt={member.name}
                    height="460"
                    width="460"
                    loading="lazy"
                  />
                </div>
                <span className="mt-2 block text-sm text-slate-900 dark:text-white">
                  {member.name}
                </span>
                <span className="text-slate-600 dark:text-gray-300 block text-xs">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
