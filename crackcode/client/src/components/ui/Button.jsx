// ─── Inject button depth styles once into <head> ─────────────────────────────
// Tailwind hover: utilities cannot override inline styles, and box-shadow with
// CSS variables can't be expressed in Tailwind arbitrary values reliably.
// This singleton injection solves both: all three shadow states (default, hover,
// active) are defined in real CSS that reads live from the theme's CSS vars.
const BUTTON_DEPTH_STYLES = `
  /* ── Primary ─────────────────────────────────────────── */
  [data-btn="primary"] {
    background: linear-gradient(to bottom, var(--btn-p-from), var(--btn-p-via), var(--btn-p-to));
    box-shadow:
      0 6px 0 0 var(--btn-p-shadow),
      0 8px 12px rgba(0,0,0,0.4);
  }
  [data-btn="primary"]:hover:not(:disabled) {
    box-shadow:
      0 4px 0 0 var(--btn-p-shadow),
      0 6px 10px rgba(0,0,0,0.4);
  }
  [data-btn="primary"]:active:not(:disabled) {
    box-shadow:
      0 2px 0 0 var(--btn-p-shadow),
      0 3px 6px rgba(0,0,0,0.4);
  }

  /* ── Secondary ───────────────────────────────────────── */
  [data-btn="secondary"] {
    background: linear-gradient(to bottom, var(--btn-s-from), var(--btn-s-via), var(--btn-s-to));
    box-shadow:
      0 6px 0 0 var(--btn-s-shadow),
      0 8px 12px rgba(0,0,0,0.3),
      inset 0  2px 0 var(--btn-s-inset-top),
      inset 0 -2px 0 rgba(0,0,0,0.06);
  }
  [data-btn="secondary"]:hover:not(:disabled) {
    background: linear-gradient(to bottom, var(--btn-s-hover-from), var(--btn-s-hover-via), var(--btn-s-hover-to));
    box-shadow:
      0 4px 0 0 var(--btn-s-shadow),
      0 6px 10px rgba(0,0,0,0.3),
      inset 0  2px 0 var(--btn-s-inset-top),
      inset 0 -2px 0 rgba(0,0,0,0.06);
  }
  [data-btn="secondary"]:active:not(:disabled) {
    box-shadow:
      0 2px 0 0 var(--btn-s-shadow),
      0 3px 6px rgba(0,0,0,0.25),
      inset 0 2px 0 var(--btn-s-inset-top);
  }

  /* ── Disabled (both) ─────────────────────────────────── */
  [data-btn="primary"]:disabled,
  [data-btn="secondary"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('crackcode-btn-depth')) {
  const style = document.createElement('style');
  style.id = 'crackcode-btn-depth';
  style.textContent = BUTTON_DEPTH_STYLES;
  document.head.appendChild(style);
}
// ─────────────────────────────────────────────────────────────────────────────


const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    disabled = false,
    fullWidth = false,
    className = '',
    type = 'button',
    ...props
}) => {

    // Base styles 
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl focus:outline-none focus-visible:outline-none transition-all duration-150 ease-out relative overflow-hidden'

    const variants = {

        primary: `
          border-2 border-[var(--btn-p-border)]
          text-white
          hover:translate-y-[2px] active:translate-y-[4px]
          focus-visible:ring-4 focus-visible:ring-[var(--btn-p-ring)]
          focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]
          [text-shadow:0_2px_4px_rgba(0,0,0,0.5),0_-1px_2px_rgba(255,255,255,0.2)]
        `,

        secondary: `
          border-2
          hover:translate-y-[2px] active:translate-y-[4px]
          focus-visible:ring-4 focus-visible:ring-[var(--btn-s-ring)]
          focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]
        `,

        outline: `
          bg-white/10 backdrop-blur-md
          border-2 border-current text-current
          shadow-[0_6px_0_0_currentColor,0_8px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.15)]
          hover:shadow-[0_4px_0_0_currentColor,0_6px_16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.1)]
          active:shadow-[0_2px_0_0_currentColor,0_3px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
          hover:translate-y-[2px] active:translate-y-[4px]
          hover:bg-white/20 active:bg-white/5
          focus-visible:ring-4 focus-visible:ring-current
          focus-visible:ring-offset-2 focus-visible:ring-offset-black
          before:absolute before:inset-0 before:rounded-2xl
          before:bg-gradient-to-b before:from-white/20 before:via-white/5 before:to-transparent
          before:pointer-events-none
          after:absolute after:inset-[2px] after:rounded-xl
          after:bg-gradient-to-b after:from-white/10 after:to-transparent
          after:pointer-events-none
        `,

        text: `
          bg-none text-[var(--brand)]
          hover:opacity-80
          focus-visible:underline
          focus-visible:ring-2 focus-visible:ring-[var(--brand)]
          focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]
          text-sm !px-0 !py-0 !border-0 !shadow-none
        `,

        ghost: 'bg-transparent focus:ring-white/20 p-0'
    };

    // ── Size styles ────────────────────────────────────────────────────────────
    const sizes = {
        sm:   'text-sm px-3 py-1.5 h-8',
        md:   'text-base px-4 py-2 h-10',
        lg:   'text-lg px-6 py-3 h-12',
        xl:   'text-xl px-8 py-4 h-14',
        icon: 'p-0'
    };

    const widthStyle    = fullWidth ? 'w-full' : '';
    const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`;

    const inlineStyle =
        variant === 'outline'   ? { color: 'var(--text)',       borderColor: 'var(--text)'         } :
        variant === 'secondary' ? { color: 'var(--btn-s-text)', borderColor: 'var(--btn-s-border)' } :
        {};

    return (
        <button
            type={type}
            data-btn={variant}
            className={`${buttonClasses} group`}
            onClick={onClick}
            disabled={disabled}
            style={inlineStyle}
            {...props}
        >
            {/*  Gloss layers — primary  */}
            {variant === 'primary' && (
                <>
                    {/* Broad top-half sheen */}
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-white/30 via-transparent to-transparent opacity-80 pointer-events-none" />
                    {/* Tighter inner specular highlight just below the top border */}
                    <div className="absolute inset-0.5 rounded-xl bg-linear-to-b from-white/20 to-transparent pointer-events-none" />
                </>
            )}

            {/*  Gloss layers — secondary */}
            {variant === 'secondary' && (
                <>
                    {/* Lighter sheen — secondary is a softer button */}
                    {/* <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-white/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                    <div className="absolute inset-0.5 rounded-xl bg-linear-to-b from-white/30 to-transparent pointer-events-none" /> */}
                </>
            )}

            {/* Label + icon */}
            <span className={`
                flex items-center justify-center relative z-10
                ${variant === 'primary'   ? 'drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]' : ''}
                ${variant === 'secondary' ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]' : ''}
                ${variant === 'outline'   ? 'drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]'  : ''}
            `}>
                {Icon && iconPosition === 'left'  && <Icon className="mr-2 w-5 h-5" />}
                {children}
                {Icon && iconPosition === 'right' && <Icon className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />}
            </span>
        </button>
    );
}

export default Button