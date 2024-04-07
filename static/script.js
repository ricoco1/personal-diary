$(document).ready(function () {
    listing();
    bsCustomFileInput.init()

  });

  function openImageTab(imageUrl) {
    window.open(imageUrl, '_blank');
}

  function listing() {
    $.ajax({
      type: "GET",
      url: "/diary",
      data: {},
      success: function (response) {
        let articles = response["articles"];
        for (let i = 0; i < articles.length; i++) {
          let title = articles[i]["title"];
          let content = articles[i]["content"];
          let file = articles[i]['file'];
          let time = articles[i]["created_at"] ? articles[i]["created_at"].slice(8, 10) + '.' + articles[i]["created_at"].slice(5, 7) + '.' + articles[i]["created_at"].slice(0, 4) : '???.??.??';
          let profile = articles[i]['profile'];
          let temp_html = `
          <div class="col-12 col-md-6 col-lg-4">
        <div class="card-group" style="margin-bottom: 10px;">
            <div class="card">
                <img src="../static/uploads/images/${file}" class="card-img-top img-fluid" style="object-fit: cover; height: 400px;" alt="image" onclick="openImageTab('../static/uploads/images/${file}')">
                <div class="card-body">
                    <img src="../static/uploads/profile/${profile || 'default_profile.jpg'}" class="card-img-top rounded-image img-fluid" style="object-fit: cover; width: 50px; height: 50px;" alt="profile picture">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${content}</p>
                    <h6 class="card-subtitle mb-2 text-muted">${time}</h6>
                </div>
            </div>
        </div>
    </div>

      
                    `;
          $("#cards-box").append(temp_html);
        }
      },
    });
  }

  function posting() {
    let title = $("#image-title").val();
    let content = $("#image-description").val();
    let file = $("#image").prop("files")[0];
    let profile = $("#profile").prop("files")[0];
    if (!file) {
      Swal.fire({
          title: 'Kesalahan',
          text: 'Silahkan pilih gambar',
          icon: 'warning',
          confirmButtonText: 'OK'
      });
      return;
  }
  
  if (title.length > 50) {
    Swal.fire({
        title: 'Kesalahan',
        text: 'Judul gambar tidak boleh lebih dari 50 karakter',
        icon: 'warning',
        confirmButtonText: 'OK'
    });
    return;
  }
  if (!title) {
    Swal.fire({
        title: 'Kesalahan',
        text: 'Judul tidak boleh kosong',
        icon: 'warning',
        confirmButtonText: 'OK'
    });
    return;
  }
  if (!content) {
    Swal.fire({
        title: 'Kesalahan',
        text: 'Deskripsi tidak boleh kosong',
        icon: 'warning',
        confirmButtonText: 'OK'
    });
    return;
  }
    let form_data = new FormData();

    form_data.append("file_give", file);
    form_data.append("profile_give", profile);
    form_data.append("title_give", title);
    form_data.append("content_give", content);

    let spinner = new Spinner().spin();
    $('#loading').append(spinner.el);

    $.ajax({
      type: "POST",
      url: "/diary",
      data: form_data,
      contentType: false,
      processData: false,
      success: function (response) {
        spinner.stop();
            Swal.fire({
                title: 'Success',
                text: response['msg'],
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
        });
      },
    });
  }