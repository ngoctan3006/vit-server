import { useRef } from 'react';
import './themeMenu.css';

const mode_settings = [
    {
        name: 'light',
        background: 'light-background',
        class: 'theme-mode-light'
    },
    {
        name: 'dark',
        background: 'dark-background',
        class: 'theme-mode-dark'
    }
];

const color_settings = [
    {
        name: 'blue',
        background: 'blue-color',
        class: 'theme-color-blue'
    },
    {
        name: 'red',
        background: 'red-color',
        class: 'theme-color-red'
    },
    {
        name: 'cyan',
        background: 'cyan-color',
        class: 'theme-color-cyan'
    },
    {
        name: 'green',
        background: 'green-color',
        class: 'theme-color-green'
    },
    {
        name: 'orange',
        background: 'orange-color',
        class: 'theme-color-orange'
    }
];

const clickOutsideRef = (content_ref, toggle_ref) => {
    document.addEventListener('mousedown', (e) => {
        // user click toggle
        if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
            content_ref.current.classList.toggle('active');
        } else {
            // user click outside toggle and content
            if (
                content_ref.current &&
                !content_ref.current.contains(e.target)
            ) {
                content_ref.current.classList.remove('active');
            }
        }
    });
};

const ThemeMenu = () => {
    const menu_ref = useRef(null);
    const menu_toggle_ref = useRef(null);

    clickOutsideRef(menu_ref, menu_toggle_ref);

    const closeMenu = () => menu_ref.current.classList.remove('active');

    return (
        <div>
            <button ref={menu_toggle_ref} className='dropdown__toggle'>
                <i className='bx bx-palette'></i>
            </button>
            <div ref={menu_ref} className='theme-menu'>
                <h4>Theme settings</h4>
                <button
                    className='theme-menu__close'
                    onClick={() => closeMenu()}>
                    <i className='bx bx-x'></i>
                </button>
                <div className='theme-menu__select'>
                    <span>Choose mode</span>
                    <ul className='mode-list'>
                        {mode_settings.map((item, index) => (
                            <li key={index}>
                                <div
                                    className={`mode-list__color ${item.background} `}>
                                    <i className='bx bx-check'></i>
                                </div>
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='theme-menu__select'>
                    <span>Choose color</span>
                    <ul className='mode-list'>
                        {color_settings.map((item, index) => (
                            <li key={index}>
                                <div
                                    className={`mode-list__color ${item.background}`}>
                                    <i className='bx bx-check'></i>
                                </div>
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ThemeMenu;
