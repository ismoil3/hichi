"use client"
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  homeIcon,
  homeIconActive,
  searchIcon,
  searchIconActive,
  compas,
  compasActive,
  video,
  videoActive,
  message,
  messageActive,
  like,
  likeActive,
  action,
  setting,
  savedIcon,
  problemIcon,
  threads,
  add,
  instagramMiniLogo,
} from '@/assets/icon/layout/svg';
import { useSearchStore } from '@/store/search-history/search-history';
import ModalDelete from '@/components/shared/modal-delete/modal-delete';
import { Person } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { apiSoftInsta } from '@/app/config/config';
import { useProfileStore } from '@/store/user-profile/user-profile';
import useCreatePost from '@/store/pages/create/createPost';
import Create from '../create-dialog/Create';

export default function SideBar({ children }) {
  let { history, getSearchHistory, setSearchValue, deleteHistory, addHistory, setOpenModalDelete, deleteAllUsers, clearSearchValue, searchValue, getUsers, users } = useSearchStore();
  const { person, getPerson } = useProfileStore();
  const { changeCreatePostDialogOpened } = useCreatePost();

  useEffect(() => {
    getPerson();
  }, []);

  useEffect(() => {
    getSearchHistory();
    getUsers();
  }, [searchValue]);

  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const router = useRouter()
  const renderIcon = (path, activeIcon, inactiveIcon) => {
    return pathname === path ? inactiveIcon : activeIcon
  }

  document.addEventListener('keydown', (e) => {
    if (e.key == 'Escape') {
      setIsSearchOpen(false)
    }
  })

  const NavLink = ({ href, icon, activeIcon, label, isActive }) => (
    <Link legacyBehavior href={href}>
      <div className={`flex items-center cursor-pointer active:opacity-50 gap-4 rounded-md p-3 hover:bg-gray-100 duration-300 hover:scale-[1.01] ${isActive(href)}`}>
        {renderIcon(href, activeIcon, icon)}
        {isSearchOpen ? '' : <p className="text-[16px]">{label}</p>}
      </div>
    </Link>
  );

  const handleSearchOpen = (is) => {
    if (is) {
      setIsSearchOpen(!isSearchOpen);
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => pathname === path ? 'font-bold' : 'font-normal';

  return (
    <div className='flex w-full h-screen'>
      <ModalDelete />
      <section className={"h-[100%] sticky top-0 border-r-[1px] duration-300 z-[100] border-gray-300 " + (isSearchOpen ? 'w-fit' : 'min-w-[245px]')}>
        <div className='flex flex-col h-full justify-between px-3 pb-4'>
          <div className="sideBar flex flex-col h-full">
            <p className={'text-3xl flex italic ' + (isSearchOpen ? "mt-8 mx-auto justify-center w-fit" : 'mt-6')}>
              {isSearchOpen ? instagramMiniLogo : "Instagram"}
            </p>
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-[6px] mt-4">
                <NavLink href="/" icon={homeIcon} activeIcon={homeIconActive} label={t('layout.home')} isActive={isActive} />
                <button onClick={() => handleSearchOpen(true)} className="flex items-center active:opacity-50 gap-4 rounded-md p-3 hover:bg-gray-100 duration-300 hover:scale-[1.01] cursor-pointer">
                  {searchIconActive}
                  {isSearchOpen ? '' : <p className="text-md">{t('layout.search')}</p>}
                </button>
                <NavLink href="/explore" icon={compas} activeIcon={compasActive} label={t('layout.explore')} isActive={isActive} />
                <NavLink href="/reels" icon={video} activeIcon={videoActive} label={t('layout.reels')} isActive={isActive} />
                <NavLink href="/chat" icon={message} activeIcon={messageActive} label={t('layout.message')} isActive={isActive} />
                <NavLink href="/notification" icon={like} activeIcon={likeActive} label={t('layout.notification')} isActive={isActive} />
                <div onClick={()=>changeCreatePostDialogOpened(true)} className="flex items-center active:opacity-50 gap-4 rounded-md p-3 hover:bg-gray-100 duration-300 hover:scale-[1.01] cursor-pointer">
                  {add}
                  {isSearchOpen ? '' : <p className="text-md">{t('layout.create')}</p>}
                </div>

                <Link href={'/profile'} className="flex items-center active:opacity-50 gap-4 rounded-md p-3 hover:bg-gray-100 duration-300 hover:scale-[1.01] cursor-pointer">
                  {person.image ?

                    <Image
                      className={`${router.pathname === '/profile'
                        ? 'border-[2px] border-[#af25ff] rounded-[50%]'
                        : 'font-[400] rounded-[50%]'
                        } text-[16px] rounded-[50%] block w-[25px] h-[25px]`}
                      src={apiSoftInsta + "/images/" + person.image}
                      width={50}
                      priority
                      height={50}
                      alt='Profile'
                    />
                    : <Person className='border-[1px] border-gray-600 rounded-full' />
                  }
                  {isSearchOpen ? '' : <p className="text-md">{t('layout.profile')}</p>}
                </Link>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <div className="flex items-center active:opacity-50 gap-4 cursor-pointer rounded-md p-3 hover:bg-gray-100 duration-300 hover:scale-[1.01]">
              <p className=''>{threads}</p>
              {isSearchOpen ? '' : <p className="text-md">{t('layout.threads')}</p>}
            </div>

            <div className="flex items-center rounded-md p-3 hover:bg-gray-100 duration-300 hover:scale-[1.01]">
              <button onClick={handleClick} className="flex items-center gap-5">
                <p className='scale-150 relative left-[4px]'>{setting}</p>
                {isSearchOpen ? '' : <p className="text-md">{t('layout.more')}</p>}
              </button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                {/* Your menu items */}
              </Menu>
            </div>
          </div>
        </div>
      </section>
      {true &&
        <div onClick={() => handleSearchOpen(false)} className={"w-full duration-700 fixed left-[72.5px] h-full z-50 ".concat(
          !isSearchOpen ? "-translate-x-[200%]" : "")
        }>
          <div
            className='flex flex-col border-r-[1px] border-l-[1px] w-[396px] bg-white rounded-r-2xl shadow-[10px_0_15px_] shadow-black/10 border-gray-500/20 h-full'
            onClick={(e) => {
              e.stopPropagation()
            }}>
            <div className='p-4 border-b-[1px] flex flex-col gap-4 pb-6 border-gray-500/20'>
              <p className='text-2xl font-[600] ml-2 mt-2'>{t('layout.search')}</p>
              <div className='mt-6 rounded-lg bg-gray-300/20 w-full items-center flex justify-between py-2 px-4'>
                <input value={searchValue} onChange={setSearchValue} className="outline-none bg-transparent w-full" type="text" placeholder={t('layout.search')} />
                {searchValue != '' &&
                  <button
                    onClick={clearSearchValue}
                    className='bg-gray-500/40 px-[3px] text-white text-sm h-fit py-[0px] rounded-full'>⨉</button>}
              </div>
            </div>
            <div>
              <div className='flex justify-between p-4'>
                <p className='font-[600] text'>Недавнее</p>
                {history.length != 0 &&
                  <button onClick={setOpenModalDelete} className='text-blue-500 hover:text-gray-500 font-[600] text-sm'>Очистить все</button>
                }
              </div>
              {searchValue.trim() == '' ?
                (history.length > 0 ? <div className='flex flex-col h-[63vh] overflow-auto'>{history.length > 0 && history?.slice(0, 7).map((person, i) =>
                  <div key={i} className='hover:bg-gray-500/10 px-5 py-2 flex items-center text-start justify-between duration-200'>
                    <div className='flex items-center gap-3'>
                      {person?.users.avatar ? (
                        <Image
                          src={'https://instagram-api.softclub.tj/images/' + person?.users.avatar}
                          width={50}
                          height={50}
                          className="rounded-full size-[45px] border"
                          alt=""
                        />
                      ) : (
                        <Person className='rounded-full ml-2 scale-[1.70] text-gray-500 mr-4 border' />
                      )}
                      <div>
                        <p className='text-sm font-[600]'>{person?.users.userName}</p>
                        <p className='text-sm text-gray-500/90'>{person?.users.fullName} • Подписчики: {person?.users.subscribersCount}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistory(person.id)
                      }}
                      className='text-lg h-fit py-[0px] font-[900] hover:bg-white/50 px-[5px] text-gray-500/90 rounded-full'>⨉</button>
                  </div>)}
                </div> :
                  <div className='w-full flex flex-col justify-center items-center h-full mt-28 text-sm font-[600] text-gray-500/80'>
                    Нет недавних запросов.
                  </div>)

                : // ________________________________________________________________
                <Suspense fallback={<div className='text-[50px] animate-spin'>◌</div>}>
                  <div className='flex flex-col max-h-[500px] h-full overflow-auto'>{users.length > 0 && users?.slice(0, 5).map((person, i) =>
                    <button
                      onClick={() => {
                        addHistory(person.id)
                      }}
                      className='hover:bg-gray-500/10 flex items-center gap-3 px-5 py-2 text-start justify-start duration-200'
                      key={i}>
                      {person?.avatar ? (
                        <Image
                          src={'https://instagram-api.softclub.tj/images/' + person.avatar}
                          width={50}
                          height={50}
                          className="rounded-full size-[45px] border"
                          alt=""
                        />
                      ) : (
                        <Person className='rounded-full ml-2 scale-[1.70] text-gray-500 mr-4 border' />
                      )}
                      <div>
                        <p className='text-sm font-[600]'>{person.userName}</p>
                        <p className='text-sm text-gray-500/90'>{person.fullName} • Подписчики: {person.subscribersCount}</p>
                      </div>
                    </button>)}
                  </div>
                </Suspense>}
            </div>
          </div>
        </div>
      }
      <div onClick={() => handleSearchOpen(false)} className="w-full h-screen overflow-auto">
        {children}
        <Create/>
      </div>
    </div>
  );
}
