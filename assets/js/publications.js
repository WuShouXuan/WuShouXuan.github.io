(function () {
    "use strict";

    function initBibtexModal() {
        var modal = document.getElementById("bibtex-modal");

        if (!modal) {
            return;
        }

        var modalTitle = document.getElementById(
            "bibtex-modal-paper-title"
        );

        var bibtexField = document.getElementById(
            "bibtex-modal-text"
        );

        var copyButton = document.getElementById(
            "bibtex-copy-button"
        );

        var status = document.getElementById(
            "bibtex-modal-status"
        );

        if (
            !modalTitle ||
            !bibtexField ||
            !copyButton ||
            !status
        ) {
            return;
        }

        var lastTrigger = null;
        var copyResetTimer = null;

        function getFocusableElements() {
            return Array.prototype.slice.call(
                modal.querySelectorAll(
                    [
                        "button:not([disabled])",
                        "textarea:not([disabled])",
                        "a[href]",
                        "input:not([disabled])",
                        "select:not([disabled])"
                    ].join(",")
                )
            );
        }

        function getBibtexFromCard(card) {
            var source = card.querySelector(
                "template.pub-bibtex-source"
            );

            if (!source) {
                return "";
            }

            if (source.content) {
                return source.content.textContent.trim();
            }

            return source.textContent.trim();
        }

        function openModal(trigger) {
            var card = trigger.closest(".pub-card");

            if (!card) {
                return;
            }

            var bibtex = getBibtexFromCard(card);

            if (!bibtex) {
                return;
            }

            lastTrigger = trigger;

            modalTitle.textContent =
                trigger.getAttribute("data-bibtex-title") ||
                "Publication";

            bibtexField.value = bibtex;
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

            bibtexField.value = "";
            status.textContent = "";

            if (copyResetTimer) {
                window.clearTimeout(copyResetTimer);
                copyResetTimer = null;
            }

            if (lastTrigger) {
                lastTrigger.focus();
            }

            lastTrigger = null;
        }

        function fallbackCopy() {
            bibtexField.focus();
            bibtexField.select();

            try {
                return document.execCommand("copy");
            } catch (error) {
                return false;
            }
        }

        function showCopySuccess() {
            status.textContent = "BibTeX copied to clipboard.";
            copyButton.classList.add("is-copied");

            if (copyResetTimer) {
                window.clearTimeout(copyResetTimer);
            }

            copyResetTimer = window.setTimeout(function () {
                copyButton.classList.remove("is-copied");
                status.textContent = "";
            }, 2200);
        }

        function showCopyFailure() {
            status.textContent =
                "Copy failed. Please select and copy the text manually.";
        }

        function copyBibtex() {
            var value = bibtexField.value;

            if (!value) {
                status.textContent =
                    "No BibTeX content is available.";
                return;
            }

            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {
                navigator.clipboard
                    .writeText(value)
                    .then(showCopySuccess)
                    .catch(function () {
                        if (fallbackCopy()) {
                            showCopySuccess();
                        } else {
                            showCopyFailure();
                        }
                    });

                return;
            }

            if (fallbackCopy()) {
                showCopySuccess();
            } else {
                showCopyFailure();
            }
        }

        document.addEventListener("click", function (event) {
            var openTrigger = event.target.closest(
                "[data-bibtex-open]"
            );

            if (openTrigger) {
                event.preventDefault();
                openModal(openTrigger);
                return;
            }

            var closeTrigger = event.target.closest(
                "[data-bibtex-close]"
            );

            if (
                closeTrigger &&
                !modal.hidden
            ) {
                event.preventDefault();
                closeModal();
            }
        });

        copyButton.addEventListener(
            "click",
            copyBibtex
        );

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
            var lastElement =
                focusable[focusable.length - 1];

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
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initBibtexModal
        );
    } else {
        initBibtexModal();
    }
})();