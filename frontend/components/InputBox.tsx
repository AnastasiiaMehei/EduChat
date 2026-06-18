interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function InputBox({ value, onChange, onSend }: InputBoxProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex gap-3 rounded-2xl border border-slate-700 bg-slate-950 p-3">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent px-2 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
        placeholder="Type your message..."
      />
      <button
        type="button"
        onClick={onSend}
        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
      >
        Send
      </button>
    </div>
  );
}
