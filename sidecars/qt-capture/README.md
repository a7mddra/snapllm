# Qt Capture Sidecar Packaging Notes

## Linux desktop identity (portal requester name)

The Qt binary sets:

- `QGuiApplication::setDesktopFileName("com.snapllm.capture")`

For Wayland/XDG portal flows, this **must** match an installed desktop entry basename exactly:

- Required desktop file: `com.snapllm.capture.desktop`
- Installed path in sidecar runtime: `qt-runtime/usr/share/applications/com.snapllm.capture.desktop`

`xtask` Linux packaging also installs a matching icon:

- `qt-runtime/usr/share/icons/hicolor/128x128/apps/com.snapllm.capture.png`

And exports `XDG_DATA_DIRS` to include `qt-runtime/usr/share` before spawning Qt so portals can resolve the desktop entry.

### Regression guardrails

If you change the app id, update all of the following together:

1. `sidecars/qt-capture/native/src/main.cpp` (`setDesktopFileName` value, without `.desktop`)
2. Desktop file basename under `sidecars/qt-capture/native/packaging/`
3. Linux packaging copy logic in `xtask/src/platforms/linux.rs`
4. Icon filename used for the desktop entry (`Icon=` key)

Do not merge Linux packaging changes that leave these values inconsistent.
