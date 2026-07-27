(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        var modal = document.getElementById("bibtex-modal");

        if (!modal) {
            return;
        }

        var modalTitle = document.getElementById("bibtex-modal-title");
        var bibtexField = document.getElementById("bibtex-modal-text");
        var copyButton = document.getElementById("bibtex-copy-button");
        var status = document.getElementById("bibtex-modal-status");

        var lastTrigger = null;

        function getFocusableElements() {
            return Array.prototype.slice.call(
                modal.querySelectorAll(
                    "button:not([disabled]), textarea:not([disabled]), " +
                    "a[href], input:not([disabled]), select:not([disabled])"
                )
            );
        }

        function openModal(trigger) {
            var card = trigger.closest(".pub-card");

            if (!card) {
                return;
            }

            var source = card.querySelector(".pub-bibtex-source");

            if (!source) {
                return;
            }

            lastTrigger = trigger;

            var paperTitle =
                trigger.getAttribute("data-bibtex-title") || "BibTeX";

            modalTitle.textContent = "BibTeX — " + paperTitle;
            bibtexField.value = source.value.trim();
            status.textContent = "";

            modal.hidden = false;
            document.body.classList.add("bibtex-modal-open");

            window.setTimeout(function () {
                copyButton.focus();
            }, 0);
        }

        function closeModal() {
            modal.hidden = true;
            document.body.classList.remove("bibtex-modal-open");

            status.textContent = "";
            bibtexField.value = "";

            if (lastTrigger) {
                lastTrigger.focus();
            }

            lastTrigger = null;
        }

        function fallbackCopy() {
            bibtexField.focus();
            bibtexField.select();

            return document.execCommand("copy");
        }

        function copyBibtex() {
            var value = bibtexField.value;

            if (!value) {
                status.textContent = "No BibTeX content is available.";
                return;
            }

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard
                    .writeText(value)
                    .then(function () {
                        status.textContent = "BibTeX copied.";
                        copyButton.focus();
                    })
                    .catch(function () {
                        var copied = fallbackCopy();

                        status.textContent = copied
                            ? "BibTeX copied."
                            : "Copy failed. Please select the text manually.";
                    });

                return;
            }

            var copied = fallbackCopy();

            status.textContent = copied
                ? "BibTeX copied."
                : "Copy failed. Please select the text manually.";
        }

        document.addEventListener("click", function (event) {
            var openTrigger = event.target.closest("[data-bibtex-open]");

            if (openTrigger) {
                event.preventDefault();
                openModal(openTrigger);
                return;
            }

            var closeTrigger = event.target.closest("[data-bibtex-close]");

            if (closeTrigger && !modal.hidden) {
                event.preventDefault();
                closeModal();
            }
        });

        copyButton.addEventListener("click", copyBibtex);

        document.addEventListener("keydown", function (event) {
            if (modal.hidden) {
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();
                closeModal();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            var focusable = getFocusableElements();

            if (focusable.length === 0) {
                return;
            }

            var firstElement = focusable[0];
            var lastElement = focusable[focusable.length - 1];

            if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        });
    });
})();