import { useEffect, useState } from "react";

export function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) {
  const [val, setVal] = useState(content);

  useEffect(() => {
    setVal(content);
  }, [content]);

  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden bg-white">
      <textarea
        className="w-full h-full min-h-[500px] p-4 focus:outline-none"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          onChange(e.target.value);
        }}
      />
    </div>
  );
}
