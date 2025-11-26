import { Link } from 'react-router-dom';

const members = [
  {
    name: 'Ahmet Yılmaz',
    role: 'CEO & Kurucu Ortak',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=460&h=460&fit=crop',
    link: '#',
  },
  {
    name: 'Ayşe Kaya',
    role: 'Tasarım Direktörü',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=460&h=460&fit=crop',
    link: '#',
  },
  {
    name: 'Mehmet Demir',
    role: 'Teknoloji Direktörü',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=460&h=460&fit=crop',
    link: '#',
  },
  {
    name: 'Zeynep Arslan',
    role: 'Proje Yöneticisi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=460&h=460&fit=crop',
    link: '#',
  },
  {
    name: 'Can Öztürk',
    role: 'Backend Geliştirici',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=460&h=460&fit=crop',
    link: '#',
  },
  {
    name: 'Elif Yıldız',
    role: 'UI/UX Tasarımcı',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=460&h=460&fit=crop',
    link: '#',
  },
  {
    name: 'Burak Şahin',
    role: 'Frontend Geliştirici',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=460&h=460&fit=crop',
    link: '#',
  },
  {
    name: 'Selin Aydın',
    role: 'Pazarlama Yöneticisi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=460&h=460&fit=crop',
    link: '#',
  },
  {
    name: 'Emre Koç',
    role: 'DevOps Mühendisi',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=460&h=460&fit=crop',
    link: '#',
  },
  {
    name: 'Deniz Aktaş',
    role: 'İçerik Yöneticisi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=460&h=460&fit=crop',
    link: '#',
  },
  {
    name: 'Barış Özkan',
    role: 'Mobil Geliştirici',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=460&h=460&fit=crop',
    link: '#',
  },
  {
    name: 'Gizem Erdoğan',
    role: 'Grafik Tasarımcı',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=460&h=460&fit=crop',
    link: '#',
  },
  {
    name: 'Oğuz Yıldırım',
    role: 'İş Geliştirme Müdürü',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=460&h=460&fit=crop',
    link: '#',
  },
  {
    name: 'Merve Çelik',
    role: 'Müşteri İlişkileri Uzmanı',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=460&h=460&fit=crop',
    link: '#',
  },
];

export default function TeamSection() {
  return (
    <section className="bg-white dark:bg-transparent py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ekibimiz
          </h2>
          <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Deneyimli ve tutkulu ekibimizle müşterilerimize en iyi hizmeti sunuyoruz
          </p>
        </div>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <div key={index} className="group overflow-hidden">
              <img
                className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
                src={member.avatar}
                alt={member.name}
                width="826"
                height="1239"
                loading="lazy"
              />
              <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                <div className="flex justify-between">
                  <h3 className="text-slate-900 dark:text-white text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                    {member.name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    _{index + 1 < 10 ? '0' + (index + 1) : index + 1}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-gray-300 inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {member.role}
                  </span>
                  <Link
                    to={member.link}
                    className="text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-light inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    Profil
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
