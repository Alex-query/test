@extends('layouts.dashboard')

@section('section')
    <div class="content-body">
        <div class="b-ordering">
            <div class="b-information">
                <div class="block-header">
                    <div class="title">
                        <h2>Dialogs</h2>
                        <p>Manage your Dialogs.</p>
                    </div>
                </div>
            </div>

            <div class="ordering-list-wrapper">

                По пользователю {{ Form::select('queue_type', $users,"all", ['class' => 'form-control m-b','id'=>"filter_user"]) }}
                <br><br>

                <div class="ui table">
                    <table class="dataTables-example">
                        <thead>
                        <tr>
                            <th>Dialog UID</th>
                            <th>Client</th>
                            <th>Via</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Record</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
@stop

@section('bottom')
    <link rel="stylesheet" href="{{ asset("bad/datatables/media/css/dataTables.bootstrap.css") }}"/>

    <script src="{{ asset("bad/datatables/media/js/jquery.dataTables.js") }}"></script>
    <script src="{{ asset("bad/datatables/media/js/dataTables.bootstrap.min.js") }}"></script>

    <script src="{{ asset("bower_components/jquery-confirm/jquery.confirm.min.js") }}"></script>
    <script src="{{ asset("js/bootstrap.min.js") }}" type="text/javascript"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

    <script type="text/javascript">

        var begin_href = <?=json_encode(route('dialog.data.post')); ?> ;
        begin_href += "?_token=" + "{{csrf_token()}}";
        var table;
        jQuery(function() {
            //dom: '<"html5buttons"B>Tfgitlp',
            table = jQuery('.dataTables-example').DataTable({
                scrollX: true,
                dom: '<"html5buttons"B>Tfgtlp',
                processing: true,
                serverSide: true,
                responsive: true,
                searching: true,
                stateSave: true,
                "language": {
                    url: "{{ asset("bad/datatables-i18n/orders.json") }}"
                },
                ajax: {
                    url: begin_href,
                    "type": "POST"
                },
                columns: [
                    { data: 'uid', name: 'uid' },
                    { data: 'client', name: 'client' },
                    { data: 'via', name: 'via' },
                    { data: 'type', name: 'type' },
                    { data: 'duration', name: 'duration' },
                    { data: 'record', name: 'record', searchable: false },
                ]

            });

            function returnUrl() {
                return begin_href + '&filter_user=' + $("#filter_user").val()
            }

            var $eventSelect = $("#filter_user");
            $eventSelect.on("change", function (e) {
                console.log(table.ajax.url(returnUrl() ));
                table.ajax.reload();
            });
        });

    </script>
@stop