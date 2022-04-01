import Functions from '../Functions.js';
import LanguageSwitch from './LanguageSwitch.js';

export default {
    render: (data) => {
        Style();
        getImages(data);
        return '';
    },
};

/**
 * STYLE
 */
let Style = async() => {
    let styleTags = /*CSS*/ `
    #uploadFileForm{
        margin-top:2em;
    }

 
    `;
    Functions.createStyle('Upload_Images_hdze_style', styleTags);
};


let getImages = (d) => {
    //
    // load all images from API
    //
    Functions.getAPIdata(`get_files_from/${d.origin}/${d.origin_id}`)
        .then((res) => {
            // deb(res);
            if (res.code === 200) {
                let files = res.data;
                // deb(files)
                files.forEach(file => {
                    addImage(file);
                });
            }
        })
        //
        // upload button & function
        //
        .then(() => {
            let innerHTML = /*HTML*/ `
                    <form id=uploadFileForm>
                        <input for=uploadFileForm type="hidden" name="origin" id="origin"  value="${d.origin}" />
                        <input for=uploadFileForm type="hidden" name="origin_id" id="origin_id"  value="${d.origin_id}" />
                        <label class="button boxShadow" for="uploadFile">upload</label>
                            <input for=uploadFileForm id="uploadFile" type="file" accept="image/*" capture="camera" style="display:none">
                    </form> `;
            Functions.setInnerHTML('fileUpload', innerHTML);
            // upload image & indert into DOM

            // add eventListener only once!
            if (body.getAttribute('uploadFileEvent') !== 'true') {
                body.setAttribute('uploadFileEvent', true)
                body.addEventListener('change', uploadFileEvent)
                deb('addEv')
            }

            function uploadFileEvent(el) {
                if (el.target.id === 'uploadFile') {
                    Functions.loadingDots('fileUpload', true)
                    event.preventDefault();
                    const formData = new FormData(el.target.form);
                    formData.append('file', el.target.files[0]);
                    // Functions.debFormData(formData);

                    Functions.uploadToAPI('upload_file', formData)
                        .then((res) => {
                            // deb(res);
                            if (res.code === 200) {
                                addImage(res.data);
                                Functions.loadingDots('fileUpload', false)
                            } else {
                                Functions.loadingDots('fileUpload', false)
                            }
                        });
                }
            } //uploadFileEvent


        })
        //
        // lightbox
        //
        .then(() => {
            if (body.getAttribute('imageEvents') !== 'true') {
                body.setAttribute('imageEvents', true)

                body.addEventListener('click', (el) => {
                    if (el.target.className === 'thumbnailImage') {
                        el.target.nextSibling.style.display = 'block';

                    }
                    if (el.target.className === 'popupImage') {
                        el.target.parentElement.style.display = 'none';

                    }
                    if (el.target.className === 'deleteButton') {
                        deb(el.target)
                        Functions.getAPIdata(`delete_entry_in/files/${el.target.dataset.delete}`)
                            .then((res) => {
                                // deb(res);
                                if (res.code === 200) {
                                    el.target.parentElement.remove()
                                    Message.warn('Image removed');
                                }
                            });
                    }
                });
            }
        })
};

function addImage(file) {
    // wrapper
    let thumbnailWrapper = document.createElement('DIV');
    thumbnailWrapper.classList.add('thumbnailWrapper');
    thumbnailWrapper.classList.add('boxShadow');
    // thumbnail
    // deb(file)
    let img = document.createElement('img');
    img.src = file.path;
    img.classList.add('thumbnailImage');
    //
    // data-db="comment_staff/project/id/3"

    let deleteButton = document.createElement('span');
    deleteButton.classList.add('deleteButton');
    deleteButton.innerHTML = 'X';
    deleteButton.dataset.delete = `${file.id}`
    thumbnailWrapper.append(deleteButton);



    thumbnailWrapper.append(img);
    // popup
    let popupWrapper = document.createElement('DIV');
    popupWrapper.classList.add('popupWrapper');
    popupWrapper.classList.add('boxShadow');

    popupWrapper.style.display = 'none';
    let img_popup = document.createElement('img');
    img_popup.src = file.path;
    img_popup.classList.add('popupImage');
    popupWrapper.append(img_popup);
    thumbnailWrapper.append(popupWrapper);

    // concat
    document.getElementById('thumbnails').append(thumbnailWrapper);
}