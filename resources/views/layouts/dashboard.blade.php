@extends('layouts.plane')

@section('body')
    <div class="outer-wrapper">
        <div class="content-wrapper">

            <!-- ======================================== >>>>> -->
            <!-- = Aside = -->
            <!-- ======================================== >>>>> -->
            <aside class="sidebar">
                <div class="inner">

                    <!-- ––––– Logo ––––– -->
                    <div class="logo">
                        <div class="inner">
                            <div class="title">Manager</div>
                            <div class="subtitle">Manage your dialogs.</div>
                        </div>
                        <div class="toggle-sidebar">
                            <i class="fa fa-dot-circle-o"></i>
                        </div>

                        <div class="sidebar-title">BM</div>
                    </div>
                    <!-- ––––– End of Logo ––––– -->

                    <!-- ––––– Navigation ––––– -->
                    <ul class="navigation">
                        <li class="section">Main</li>
                        <!--<li class="active"><a href="#">Текущие заказы <span class="current">2</span></a></li>-->
                        <li {{ (Request::is('*dialog/list') ? 'class="active"' : '') }}>
                            <a href="{{ route ('dialog.list.index') }}">
                                <div class="inner">Dialogs</div>
                                <i class="ion-android-list"></i>
                            </a>
                        </li>
                        <li {{ (Request::is('*apidocumentation*') ? 'class="active"' : '') }}>
                            <a href="{{ route ('apidocumentation.list.index') }}">
                                <div class="inner">Api Documentation</div>
                                <i class="ion-android-list"></i>
                            </a>
                        </li>
                        <li {{ (Request::is('*auth/logout*') ? 'class="active"' : '') }}>
                            <a href="{{ route ('auth.logout') }}">
                                <div class="inner">Logout</div>
                                <i class="ion-android-document"></i>
                            </a>
                        </li>
                    </ul>
                    <!-- ––––– End of Navigation ––––– -->

                </div>
            </aside>
            <!-- = End of Aside = -->
            <!-- ======================================== <<<<< -->

            <!-- ======================================== >>>>> -->
            <!-- = Content = -->
            <!-- ======================================== >>>>> -->
            <div class="content-right">

                <!-- ––––– Header ––––– -->
                <header class="content-header">

                    <!-- ––––– Mini profile ––––– -->
                    <div class="right-part">
                        <div class="name">
                            <a href="#">{{ Auth::user()->login }}</a>
                        </div>
                    </div>
                    <!-- ––––– End of Mini profile ––––– -->

                </header>
                <!-- ––––– End of Header ––––– -->

                @yield('section')

            </div>
            <!-- = End of Content = -->
            <!-- ======================================== <<<<< -->

        </div>
    </div>
    @yield('modal_w')
@stop