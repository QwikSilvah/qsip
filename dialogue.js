// JavaScript source code

//ensure bootstrap 5 and boilerplate html for modal

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
        else {
            modalFooter.querySelector(".disassociate").classList.add("btn-primary");
        }               

        if (styles) {
            if (styles.header) {
                const headerClass = styles.header.includes("bg-") ? styles.header : "bg-" + styles.header;
                document.querySelector(".modal .modal-header").classList.add(headerClass);
            }
            if (styles.content) {
                const contentClass = styles.content.includes("bg-") ? styles.content : "bg-" + styles.content;
                document.querySelector(".modal .modal-body").classList.add(contentClass);
            }
            if (styles.footer) {
                const footerClass = styles.footer.includes("bg-") ? styles.footer : "bg-" + styles.footer;
                document.querySelector(".modal .modal-footer").classList.add(footerClass);
            }
        }

        modalActivateButton.click();

        if (callback) {
            callback();
        }
    },
}