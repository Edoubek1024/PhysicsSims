const konami = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function initEasterEgg() {
  console.log(
    "%c⚛ PhysicsSims by IlliniOpenEdu\n%cBuilt during academic suffering.",
    "color:#23E3EE;font-size:16px;font-weight:bold;",
    "color:#94a3b8;font-size:12px;"
  );

  let index = 0;
  let enabled = false;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== konami[index]) {
      index = 0;
      return;
    }

    index++;

    if (index === konami.length) {
      index = 0;
      enabled = !enabled;

      document.body.style.transition = "filter 0.6s ease";

      if (enabled) {
        document.body.style.filter =
          "hue-rotate(35deg) saturate(1.3)";
      } else {
        document.body.style.filter = "";
      }

      console.log(
        "%cChaos Mode Activated",
        "color:#22d3ee;font-size:14px;font-weight:bold;"
      );
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    document.body.style.transition = '';
    document.body.style.filter = '';
  };
}