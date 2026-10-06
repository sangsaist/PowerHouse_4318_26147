/* =========================================
   LOAD PROJECT
========================================= */

async function loadProject() {

    try {


        /* =====================================
           LOAD JSON
        ====================================== */

        const response =
            await fetch(
                "data/project.json"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load data/project.json"
            );

        }


        const project =
            await response.json();



        /* =====================================
           PAGE TITLE
        ====================================== */

        document.title =
            `${project.project} — ${project.team}`;



        /* =====================================
           TEAM
        ====================================== */

        document.getElementById(
            "teamName"
        ).textContent =
            project.team;



        /* =====================================
           EVENT
        ====================================== */

        document.getElementById(
            "event"
        ).textContent =
            `${project.event.replace("Smart India Hackathon", "SIH")} · ${project.problemStatement}`;



        /* =====================================
           PROJECT NAME
        ====================================== */

        document.getElementById(
            "projectName"
        ).textContent =
            project.project;



        /* =====================================
           DESCRIPTION
        ====================================== */

        document.getElementById(
            "description"
        ).textContent =
            project.description;



        /* =====================================
           PROJECT LINKS
        ====================================== */

        const linksContainer =
            document.getElementById(
                "links"
            );


        linksContainer.innerHTML = "";


        const linkLabels = {

            github:
                "GitHub",

            documentation:
                "Documentation",

            software:
                "Software",

            youtube:
                "Project Pitch"

        };


        Object.entries(
            project.links || {}
        ).forEach(
            ([key, url]) => {


                /*
                    Ignore missing links.
                */

                if (
                    !url ||
                    url === "#"
                ) {

                    return;

                }


                const link =
                    document.createElement(
                        "a"
                    );


                link.className =
                    "link";


                link.href =
                    url;


                link.target =
                    "_blank";


                link.rel =
                    "noopener noreferrer";


                link.textContent =
                    linkLabels[key] ||
                    key;


                linksContainer.appendChild(
                    link
                );

            }
        );



        /* =====================================
           SCREENSHOTS
        ====================================== */

        const screensContainer =
            document.getElementById(
                "screens"
            );


        const screenshots =
            project.screenshots || [];

        const image = document.getElementById("screenshotImage");
        const title = document.getElementById("screenshotTitle");
        const description = document.getElementById("screenshotDescription");
        const indicators = document.getElementById("slideIndicators");
        const previousButton = document.getElementById("previousScreenshot");
        const nextButton = document.getElementById("nextScreenshot");
        let activeIndex = 0;
        let transitionId = 0;
        let slideshowTimer;
        let isPaused = false;

        if (!screenshots.length) {
            screensContainer.hidden = true;
            return;
        }

        const indicatorButtons = screenshots.map((screenshot, index) => {
            const button = document.createElement("button");
            button.className = "slide-indicator";
            button.type = "button";
            button.setAttribute("aria-label", `Show ${screenshot.title}`);
            button.addEventListener("click", () => selectScreenshot(index));
            indicators.appendChild(button);
            return button;
        });

        function updateIndicators() {
            indicatorButtons.forEach((button, index) => {
                const isActive = index === activeIndex;
                button.classList.toggle("active", isActive);
                button.setAttribute("aria-current", isActive ? "true" : "false");
            });
        }

        function showScreenshot(index, animate = true) {
            activeIndex = (index + screenshots.length) % screenshots.length;
            const screenshot = screenshots[activeIndex];
            const currentTransition = ++transitionId;

            window.clearTimeout(slideshowTimer);
            updateIndicators();

            const updateContent = () => {
                if (currentTransition !== transitionId) {
                    return;
                }

                title.textContent = screenshot.title;
                description.textContent = screenshot.description;
                image.alt = screenshot.title;
                image.onload = () => image.classList.remove("is-changing");
                image.onerror = () => image.classList.remove("is-changing");
                image.src = screenshot.image;

                if (image.complete) {
                    image.classList.remove("is-changing");
                }
            };

            if (animate) {
                image.classList.add("is-changing");
                window.setTimeout(updateContent, 220);
            } else {
                updateContent();
            }
        }

        function startSlideshow() {
            window.clearTimeout(slideshowTimer);

            if (isPaused) {
                return;
            }

            slideshowTimer = window.setTimeout(() => {
                showScreenshot(activeIndex + 1);
                startSlideshow();
            }, 4500);
        }

        function selectScreenshot(index) {
            showScreenshot(index);
            startSlideshow();
        }

        previousButton.addEventListener("click", () => {
            selectScreenshot(activeIndex - 1);
        });

        nextButton.addEventListener("click", () => {
            selectScreenshot(activeIndex + 1);
        });

        screensContainer.addEventListener("mouseenter", () => {
            isPaused = true;
            window.clearTimeout(slideshowTimer);
        });

        screensContainer.addEventListener("mouseleave", () => {
            isPaused = false;
            startSlideshow();
        });

        showScreenshot(0, false);
        startSlideshow();

    }


    catch (error) {

        console.error(
            "SigIQ website error:",
            error
        );

    }

}


/* =========================================
   START WEBSITE
========================================= */

loadProject();