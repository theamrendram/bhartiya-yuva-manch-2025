export default function Bar({ classname }: { classname?: string }) {
  return (
    <div
      className={`w-24 h-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 ${classname}`}
    />
  );
}
