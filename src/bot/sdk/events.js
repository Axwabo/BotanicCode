addEventListener("message", ev => {
    if (ev.data?.type === "render")
        dispatchEvent(new Event("render"));
});
