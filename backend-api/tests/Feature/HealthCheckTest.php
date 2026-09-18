<?php

it('reports the application as up on the health check route', function () {
    $this->get('/up')->assertOk();
});
