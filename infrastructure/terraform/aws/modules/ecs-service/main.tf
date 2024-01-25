module "ecs_service" {
  source = "terraform-aws-modules/ecs/aws//modules/service"
  name = "${var.cluster_info.name}-${var.service_name}"

  cluster_arn = var.cluster_info.cluster_arn
  enable_execute_command = true

  cpu    = var.resources.cpu
  memory = var.resources.memory
  desired_count = var.resources.desired_count
  # execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  # task_role_arn            = aws_iam_role.ecs_task_role.arn

  # Container definition(s)
  container_definitions = {

    "${var.service_name}" = {
      essential = true
      image     = "${var.repository_url}:latest"
      port_mappings = [{
        protocol      = "tcp"
        containerPort = var.configuration.container_port
        hostPort      = var.configuration.container_port
      }]

      environment = var.configuration.environment

      readonly_root_filesystem = false

      log_configuration = {
        logDriver = "awslogs",
        options = {
          awslogs-group = var.cluster_info.cloudwatch_log_group_name,
          awslogs-region = var.cluster_info.region,
          awslogs-stream-prefix = "ecs"
        }
      }
      # memory_reservation = 100
    }
  }


  load_balancer = {
    service = {
      target_group_arn = var.cluster_info.lb_target_group_arn
      container_name   = var.service_name
      container_port   = var.configuration.container_port
    }
  }

  subnet_ids = var.cluster_info.private_subnet_ids
  security_group_ids = var.cluster_info.container_security_group_ids
  assign_public_ip = false

  tags = {
    Environment = "${var.cluster_info.name}-${var.cluster_info.environment}"
    Project     = "Pubpub-v7"
  }

  # this lifecycle property allows us to update the version of the container image without terraform clobbering it later
  # changing the container image creates a "revision" of the task definition
  # lifecycle {
  #   ignore_changes = [services.core.container_definitions.core.image]
  # }
}
