type Props = {
  className?: string;
};

export default function DividerLine({ className }: Props) {
  return (
    <div className={`py-8 ${className ? className : ''}`}>
      <span className='block w-full h-[1px] bg-slate-200'></span>
    </div>
  );
}
