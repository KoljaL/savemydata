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
        margin-top:.5em;
    }
    #thumbnails .thumbnailImage{
        margin:.5em;
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
                        <input for=uploadFileForm type="hidden" name="origin" id="upload_origin"  value="${d.origin}" />
                        <input for=uploadFileForm type="hidden" name="origin_id" id="upload_origin_id"  value="${d.origin_id}" />
                        <input for=uploadFileForm type="hidden" name="type" id="upload_type"  value="${d.type}" />
                        <input for=uploadFileForm type="hidden" name="name" id="upload_name"  value="${d.name}" />
                        <label class="button boxShadow" for="uploadFile">new Image</label>
                        <input for=uploadFileForm id="uploadFile" type="file" accept="image/*" capture="camera" style="display:none">
                    </form> `;
            Functions.setInnerHTML('fileUpload', innerHTML);
            // upload image & indert into DOM

            // add eventListener only once!
            if (body.getAttribute('uploadFileEvent') !== 'true') {
                body.setAttribute('uploadFileEvent', true)
                body.addEventListener('change', uploadFileEvent)
            }

            function uploadFileEvent(el) {
                if (el.target.id === 'uploadFile') {
                    event.preventDefault();
                    Functions.loadingDots('fileUpload', true)

                    let uploadName = (el.target.files[0].name).split('.')[0];
                    uploadName = prompt("Please enter a name:", uploadName);
                    // deb(uploadName)
                    document.getElementById('upload_name').value = uploadName;

                    // deb(el.target.form)
                    const formData = new FormData(el.target.form);
                    formData.append('file', el.target.files[0]);
                    formData.append('name', document.getElementById('upload_name').value);
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
                        el.target.nextSibling.style.opacity = '0';
                        el.target.nextSibling.style.display = 'block';
                        setTimeout(() => {
                            el.target.nextSibling.style.opacity = '1';
                        }, 100);

                    }
                    if (el.target.className === 'popupImage') {
                        el.target.parentElement.style.opacity = '0';
                        setTimeout(() => {
                            el.target.parentElement.style.display = 'none';
                        }, 200);

                    }
                    if (el.target.className === 'deleteButton') {
                        // deb(el.target)
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
    // deb(file)
    // wrapper
    let thumbnailWrapper = document.createElement('DIV');
    thumbnailWrapper.classList.add('thumbnailWrapper');
    thumbnailWrapper.classList.add('boxShadow');
    // thumbnail
    // deb(file)
    let img = document.createElement('img');
    img.title = file.name;
    img.alt = file.name;
    img.src = file.path_thumb;
    img.classList.add('thumbnailImage');


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