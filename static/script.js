$(document).ready(function () {
    listing();
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
          let temp_html = `
            <div class="col-4">
              <div class="card" style="margin-bottom: 10px;">
                <img
                  src="https://www.gardendesign.com/pictures/images/675x529Max/site_3/helianthus-yellow-flower-pixabay_11863.jpg"
                  class="card-img-top"
                  alt="..."
                />
                <div class="card-body">
                  <h5 class="card-title">${title}</h5>
                  <p class="card-text">${content}</p>
                  <h6 class="card-subtitle mb-2 text-muted">2022.02.14</h6>
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
    let spinner = new Spinner().spin();
     $('#loading').append(spinner.el);
    $.ajax({
      type: "POST",
      url: "/diary",
      data: { title_give: title, content_give: content },
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