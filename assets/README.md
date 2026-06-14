# Assets

## dev-horse.png

The Coverage grid's "开发中 / More coverage coming" cell loads `dev-horse.png`
from this folder. Save the horse-at-laptop image here as:

```
assets/dev-horse.png
```

Until the file exists, the cell falls back to a 🐴 emoji plus the label, so the
layout never shows a broken image. If you prefer a different filename or format
(e.g. `.webp`), update the `src` in `renderOrganizations()` in `app.js`.
