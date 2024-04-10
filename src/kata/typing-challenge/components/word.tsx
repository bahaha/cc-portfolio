type WordProps = {
  children?: React.ReactNode;
};

function Word({ children }: WordProps) {
  return (
    <div data-role="word" className="m-1">
      {children}
    </div>
  );
}

type LetterProps = {
  expect: string;
};
function Letter({ expect }: LetterProps) {
  return <span data-role="letter">{expect}</span>;
}

export default Word;
Word.Letter = Letter;
