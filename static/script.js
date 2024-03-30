$(document).ready(function () {
    listing();
    bsCustomFileInput.init()

  });

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
          let file = articles[i]['file'] || 'default-image.jpg';
          let temp_html = `
        <div class="col-4">
            <div class="card">
                <img src="../static/${file}"
                    class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${content}</p>
                    <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
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
    if (title.length > 50) {
      Swal.fire({
          title: 'Error',
          text: 'Judul tidak boleh lebih dari 50 karakter',
          icon: 'error',
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
    let file = $("#image").prop("files")[0];

    let form_data = new FormData();

    form_data.append("file_give", file);
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