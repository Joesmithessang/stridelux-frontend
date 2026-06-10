export default function LoadingSpinner({ fullPage = false, size = 40 }) {
  const spinner = (
    <div className="spinner" style={{ width: size, height: size }}>
      <div className="spinner-ring" />
    </div>
  );

  if (fullPage) {
    return (
      <div className="spinner-fullpage">
        {spinner}
      </div>
    );
  }
  return spinner;
}
