import OwlCharacter from './OwlCharacter';

export default function ChatbotIcon() {
  return (
    <div
      className="fixed bottom-2 right-2 z-50 pointer-events-none"
      aria-hidden="true"
      style={{ width: 120, height: 144 }}
    >
      <OwlCharacter size={120} />
    </div>
  );
}
