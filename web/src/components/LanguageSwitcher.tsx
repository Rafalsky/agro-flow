import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    const currentLang = i18n.language === 'en' ? 'en' : 'pl';
    const currentFlag = currentLang === 'en' ? '🇬🇧' : '🇵🇱';

    return (
        <div style={{ position: 'relative', zIndex: 100 }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    color: 'white'
                }}
                title="Change Language / Zmień język"
            >
                {currentFlag}
            </button>

            {isOpen && (
                <>
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="glass-panel" style={{
                        position: 'absolute',
                        top: '110%',
                        right: 0,
                        padding: '0.5rem',
                        zIndex: 100,
                        minWidth: '140px',
                        backgroundColor: '#1a1f2e',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        <button
                            onClick={() => changeLanguage('pl')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                width: '100%',
                                padding: '0.75rem',
                                background: currentLang === 'pl' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                textAlign: 'left',
                                borderRadius: '0.375rem',
                                marginBottom: '0.25rem',
                                fontSize: '0.9rem'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>🇵🇱</span>
                            <span>Polski</span>
                        </button>
                        <button
                            onClick={() => changeLanguage('en')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                width: '100%',
                                padding: '0.75rem',
                                background: currentLang === 'en' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                textAlign: 'left',
                                borderRadius: '0.375rem',
                                fontSize: '0.9rem'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>🇬🇧</span>
                            <span>English</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
