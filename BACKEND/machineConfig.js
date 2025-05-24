const machineNodeMap = {
  babymaker: {
    endpoint: "opc.tcp://Abdelkarims-MacBook-Pro.local:4840/babymaker",
    nodes: {
      rotations: "ns=1;s=babymaker.Rotations",
      material: "ns=1;s=babymaker.Material"
    }
  },
  controlplug: {
    endpoint: "opc.tcp://Abdelkarims-MacBook-Pro.local:4841/controlplug",
    nodes: {
      voltage: "ns=1;s=controlplug.Voltage",
      tolerance: "ns=1;s=controlplug.Tolerance"
    }
  },
  robot: {
    endpoint: "opc.tcp://Abdelkarims-MacBook-Pro.local:4842/robot",
    nodes: {
      movementSpeed: "ns=1;s=robot.MovementSpeed",
      gripForce: "ns=1;s=robot.GripForce"
    }
  }
};

module.exports = machineNodeMap;
