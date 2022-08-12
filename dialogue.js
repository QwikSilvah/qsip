// JavaScript source code

//Ensure bootstrap 5 and modal markup

const dialogue = {
    showAlert({ target, alertClass, content, close, width, duration }) {
        target.classList.add("alert");
        if (alertClass) {
            if (alertClass.includes("alert-")) target.classList.add(alertClass);
            else target.classList.add("alert-" + alertClass);
        }
        if (content) {
            target.innerHTML = content;
        }
        if (close) {
            target.classList.add("alert-dismissible");
            target.innerHTML += ` <button class="btn-close" data-bs-dismiss="alert"></button>`;
        }
        //setting styles
        target.style.width = width || "100%";
        target.style.marginBottom = "0px";
        target.style.display = "block";

        //setting duration
        const displayDuration = duration || 5000;
        window.setTimeout(() => {
            target.style.display = "none";
        }, displayDuration);
    },        
    
    showModal({ type, accept, reject, header, content, styles, callback }) {
        const modalActivateButton = document.querySelector(".lasso-modal");

        //header
        document.querySelector(".modal .modal-title").innerHTML =
            `${header ? header : ""}`;        

        //content
        document.querySelector(".modal .modal-body").innerHTML =
            `${content ? content : ""}`;        

        //footer
        const modalFooter = document.querySelector(".modal .modal-footer");
        modalFooter.innerHTML = "";

        if (type && type.toLowerCase() === "confirm") {
            modalFooter.innerHTML =
                `<button type="button" class="corroborate btn btn-primary" data-bs-dismiss="modal">${accept ? accept : "Ok"
                }</button >`;
            
        }        

        modalFooter.innerHTML +=
            `<button type="button" class="disassociate btn" data-bs-dismiss="modal">${reject ? reject : "Close"}</button>`;
        if (modalFooter.querySelector(".corroborate")) {
            modalFooter.querySelector(".disassociate").classList.add("btn-secondary");
        }                   

        if (styles) {
            const headerElement = document.querySelector(".modal .modal-header");
            const contentElement = document.querySelector(".modal .modal-body");
            const footerElement = document.querySelector(".modal .modal-footer");
            const elementArray = [headerElement, contentElement, footerElement];

            let confirmElement;
            if (document.querySelector(".corroborate")) {
                confirmElement = document.querySelector(".corroborate");
            }
            else confirmElement = document.querySelector(".disassociate");

            for (let element of elementArray) {
                for (let item of element.classList) {
                    if (item.includes("bg-")) {
                        element.classList.remove(item);
                    }
                }
            }

            if (styles.header) {
                if (styles.header.background) {
                    const headerClass = styles.header.background.includes("bg-") ? styles.header.background : "bg-" + styles.header.background;
                    headerElement.classList.add(headerClass);
                }

                if (styles.header.color) {
                    headerElement.style.color = styles.header.color;
                }
            }

            if (styles.content) {
                if (styles.content.background) {
                    const contentClass = styles.content.background.includes("bg-") ? styles.content.background : "bg-" + styles.content.background;
                    contentElement.classList.add(contentClass);
                }

                //insert content text style option

                if (styles.footer) {
                    const footerClass = styles.footer.includes("bg-") ? styles.footer : "bg-" + styles.footer;
                    footerElement.classList.add(footerClass);
                }
            }

            if (!styles.confirm) {
                styles.confirm = styles.header.background;
            }
            if (confirmElement && styles.confirm) {
                const confirmClass = styles.confirm.includes("btn-") ? styles.confirm : "btn-" + styles.confirm;

                for (let item of confirmElement.classList) {
                    if (item.includes("btn-")) {
                        confirmElement.classList.remove(item);
                    }
                }

                confirmElement.classList.add(confirmClass);
            }
        }

        modalActivateButton.click();

        if (callback) {
            callback();
        }
    },
}

